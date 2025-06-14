import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { User } from "../models/user.models.js"
import { Book } from "../models/book.model.js"
import { Order } from "../models/order.models.js"

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { orderData } = req.body

    if (!Array.isArray(orderData) || orderData.length === 0) {
      throw new ApiError(400, "Order data must be a non-empty array")
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const createdOrders = [];

    for (const order of orderData) {
      const { bookId } = order

      const isInCart = user.cart.some(
        (item) => item.toString() === bookId.toString()
      );

      if (!isInCart) {
        continue; // skip if book is not in cart
      }
      const orderedBook = await Book.findById(bookId)

      // Create new order
      const newOrder = new Order({
        book: bookId,
        user: user._id,
        seller: orderedBook.seller, // Assuming seller is provided in orderData
      })

      await newOrder.save()
      createdOrders.push(newOrder)

      // Add order to user's orders list
      user.orders.push(newOrder._id)

      // Remove book from cart
      user.cart = user.cart.filter(
        (item) => item.toString() !== bookId.toString()
      )
    }

    await user.save();

    return res.status(201).json(
      new ApiResponse(201, createdOrders, "Order(s) placed successfully")
    )
  } 
  catch (error) {
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
})


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