import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Book } from "../models/book.model.js";
import { Order } from "../models/order.models.js";

const placeOrder = asyncHandler(async (req, res) => {
    const { orderData } = req.body;

    if (!Array.isArray(orderData) || orderData.length === 0) {
        throw new ApiError(400, "Order data must be a non-empty array");
    }

    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    const createdOrders = [];

    for (const item of orderData) {
        const bookId = item.book._id ? item.book._id : item.book;
        const quantity = item.quantity || 1;

        // Verify item is actually in user's cart
        const isInCart = user.cart.some(
            (cartItem) => cartItem.book.toString() === bookId.toString()
        );

        if (!isInCart) continue;

        const book = await Book.findById(bookId);
        if (!book) continue;

        // GENERATE RANDOM 6-DIGIT CODE
        const deliveryCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newOrder = new Order({
            book: bookId, 
            // SNAPSHOTTING: Save details so they persist if book is deleted
            bookSnapshot: {
                title: book.title,
                price: book.price,
                image: book.url, // or book.image depending on your schema
                author: book.author
            },
            user: user._id,
            seller: book.seller,
            quantity,
            deliveryCode: deliveryCode 
        });

        await newOrder.save();
        createdOrders.push(newOrder);

        // Update user record
        user.orders.push(newOrder._id);
        user.cart = user.cart.filter(
            (cartItem) => cartItem.book.toString() !== bookId.toString()
        );
    }

    await user.save();
    return res.status(201).json(new ApiResponse(201, createdOrders, "Order(s) placed successfully"));
});

const getUserOrders = asyncHandler(async (req, res) => {
    
    const orders = await Order.find({ user: req.user._id })
        .populate({
            path: "book",
            populate: { path: "seller", select: "username email" },
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) throw new ApiError(404, "User not found");

    let query = {};

    if (user.role === "admin") {
        query = {}; 
    } else if (user.role === "seller") {
        // ✅ This works now because we have the seller field in Schema
        query = { seller: user._id }; 
    } else {
        throw new ApiError(403, "Access denied");
    }

    const orders = await Order.find(query)
        .populate("book") 
        .populate("user", "username email name") 
        .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => {
        const orderData = order.toObject();

        // ✅ Fallback logic: If book is deleted, use Snapshot
        if (!orderData.book) {
            orderData.book = {
                ...orderData.bookSnapshot, // Contains title, price, image, sellerName
                isDeleted: true
            };
        }

        return orderData;
    });

    return res.status(200).json(
        new ApiResponse(200, formattedOrders, "Orders fetched successfully")
    );
});

const updateStatus = asyncHandler(async (req, res) => {
    const { orderId, status, deliveryCode } = req.body;

    if (!orderId || !status) {
        throw new ApiError(400, "Order ID and status are required");
    }

    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");

    // AUTH CHECK: Is the person updating this the seller or admin?
    const isSeller = order.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isSeller && !isAdmin) {
        throw new ApiError(403, "Unauthorized to update this order");
    }

    // VERIFICATION: Check delivery code if status is being set to delivered
    if (status === "delivered") {
        if (!deliveryCode || order.deliveryCode !== deliveryCode) {
            throw new ApiError(400, "Invalid delivery verification code");
        }
    }

    order.status = status;
    await order.save();

    return res.status(200).json(new ApiResponse(200, order, "Status updated"));
});

export { placeOrder, getUserOrders, getAllOrders, updateStatus };