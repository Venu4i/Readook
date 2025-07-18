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

const getUserOrders = asyncHandler( async (req,res) => {
    try {
        const user = await User.findById(req.user?._id).populate({
            path: 'orders',
            populate: { path : 'book' } 
        })
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const userOrders = user.orders.reverse() // Reverse to show latest orders first;
        if (userOrders.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "no active orders"));
        }
        return res.status(200).json(
            new ApiResponse(200, userOrders, "User orders fetched successfully")
        )
    } 
    catch (error) {
        throw new ApiError(500, error ? error : "Internal Server Error")
    }
})

const getAllOrders = asyncHandler(async (req,res) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if(user.role !== "admin") {
            throw new ApiError(403, "Only admins can access all orders");
        }
        const userData = await Order.find({ seller: req.user._id }) // 👈 only orders for this seller
            .populate("book")
            .populate("user")
            .populate("seller")
            .sort({ createdAt: -1 })
            
        if (!userData || userData.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No orders found"));
        } 
        return res.status(200).json(
            new ApiResponse(200, userData, "All orders fetched successfully")
        )
    }
    catch (error) {
        throw new ApiError(500, error ? error : "Internal Server Error")
    }
})

const updateStatus = asyncHandler( async (req, res)=> {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            throw new ApiError(400, "Order ID and status are required");
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new ApiError(400, "Invalid order ID format");
        }
        const order = await Order.findById(orderId);
        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        order.status = status;
        await order.save();
        return res.status(200).json(
            new ApiResponse(200, order, "Order status updated successfully")
        )
    } 
    catch (error) {
        throw new ApiError(500, error ? error : "Internal Server Error")
    }
})

export {
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateStatus
}