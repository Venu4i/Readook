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

  const user = await User.findById(req.user?._id).populate("cart.book");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  console.log(user.cart)

  const existingCartItem = user.cart.find(
    (item) => item.book._id.toString() === bookId
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

  const user = await User.findById(req.user?._id).populate("cart.book");;
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cartItemIndex = user.cart.findIndex(
    (item) => item.book._id.toString() === bookId
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

  const booksInCart = user.cart.filter(item => item.book); // remove null refs

  if (booksInCart.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Cart is empty"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, booksInCart, "Books in cart retrieved successfully")
    );
});

export { addToCart, deleteFromCart, getCart };
