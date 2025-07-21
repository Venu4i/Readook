import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { User } from "../models/user.models.js"
import { Book } from "../models/book.model.js"
import { Order } from "../models/order.models.js"

const placeOrder = asyncHandler(async (req, res) => {
  const { orderData } = req.body; // this is the full cart: [{ book, quantity }, ...]

  if (!Array.isArray(orderData) || orderData.length === 0) {
    throw new ApiError(400, "Order data must be a non-empty array");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const createdOrders = [];

  for (const item of orderData) {
    const bookId = item.book._id ? item.book._id : item.book;
    const quantity = item.quantity || 1;

    // Check if book is still in the user's cart
    const isInCart = user.cart.some(
      (cartItem) => cartItem.book.toString() === bookId.toString()
    );

    if (!isInCart) continue;

    const book = await Book.findById(bookId);
    if (!book) continue;

    const newOrder = new Order({
      book: bookId,
      user: user._id,
      seller: book.seller,
      quantity, // only if Order model has quantity field
    });

    await newOrder.save();
    createdOrders.push(newOrder);

    // Add to user's orders
    user.orders.push(newOrder._id);

    // Remove from cart
    user.cart = user.cart.filter(
      (cartItem) => cartItem.book.toString() !== bookId.toString()
    );
  }

  await user.save();

  return res.status(201).json(
    new ApiResponse(201, createdOrders, "Order(s) placed successfully")
  );
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Find orders where this user is the buyer
    const orders = await Order.find({ user: user._id })
      .populate({
        path: "book",
        populate: {
          path: "seller",
          select: "name email", // Optional: display seller details
        },
      })
      .sort({ createdAt: -1 }); // Show latest first

    if (!orders || orders.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No active orders"));
    }

    return res.status(200).json(
      new ApiResponse(200, orders, "User orders fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});


const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let orders = [];

    if (user.role === "admin") {
      // Admin gets all orders
      orders = await Order.find({})
        .populate({
          path: "book",
          populate: { path: "seller", select: "name email" }
        })
        .populate("user")
        .sort({ createdAt: -1 });

    } else if (user.role === "seller") {
      // Seller gets orders only for their books
      const sellerBookIds = await Book.find({ seller: user._id }).select("_id");

      orders = await Order.find({ book: { $in: sellerBookIds } })
        .populate({
          path: "book",
          populate: { path: "seller", select: "name email" }
        })
        .populate("user")
        .sort({ createdAt: -1 });

    } else {
      throw new ApiError(403, "Only sellers and admins can access this route");
    }

    return res.status(200).json(
      new ApiResponse(200, orders, "Orders fetched successfully")
    );
  } catch (error) {
    console.error("getAllOrders error:", error);
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});



const updateStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      throw new ApiError(400, "Order ID and status are required");
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID format");
    }

    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const order = await Order.findById(orderId).populate({
      path: "book",
      populate: {
        path: "seller",
        select: "_id name email",
      },
    });

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Check if current user is either admin or the seller of the book
    const isAdmin = user.role === "admin";
    const isSellerOfBook =
      order.book &&
      order.book.seller &&
      order.book.seller._id.toString() === userId.toString();

    if (!isAdmin && !isSellerOfBook) {
      throw new ApiError(403, "You are not authorized to update this order");
    }

    order.status = status;
    await order.save();

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Order status updated successfully"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});


export {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateStatus
}