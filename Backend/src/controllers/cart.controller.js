import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Book } from "../models/book.model.js";

const addToCart = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, "Invalid book ID format");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }


  if (book.seller && book.seller.isBlacklisted) {
    throw new ApiError(
      403, 
      "This seller is currenlt unavailable."
    );
  }

  const user = await User.findById(req.user?._id).populate("cart.book");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingCartItem = user.cart.find(
    (item) => item.book && item.book._id.toString() === bookId
  );

  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    user.cart.push({ book: bookId, quantity: 1 });
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book added to cart successfully"));
});


const deleteFromCart = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new ApiError(400, "Invalid book ID format");
  }

  const user = await User.findById(req.user?._id).populate("cart.book");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cartItemIndex = user.cart.findIndex(
    (item) => item.book && item.book._id.toString() === bookId
  );

  if (cartItemIndex === -1) {
    throw new ApiError(400, "Book is not in cart");
  }

  const item = user.cart[cartItemIndex];

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    user.cart.splice(cartItemIndex, 1);
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Book removed from cart successfully"));
});


const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).populate("cart.book");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Filter out any cart items with null books
  const validCartItems = user.cart.filter(item => item.book);

  // Optional: Auto-remove null books from the user's cart to keep it clean
  const invalidItems = user.cart.filter(item => !item.book);
  if (invalidItems.length > 0) {
    user.cart = validCartItems;
    await user.save(); // Save the cleaned cart
  }

  return res.status(200).json(
    new ApiResponse(200, validCartItems, "Books in cart retrieved successfully")
  );
});


export { addToCart, deleteFromCart, getCart };
