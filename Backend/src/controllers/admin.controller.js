import { User } from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { Order } from '../models/order.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAdminDashboardData = asyncHandler(async (req, res) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Unauthorized: Only administrators can get stats");
    }

    try {
        // 1. Fetch Basic Counts
        const [totalBooks, totalUsers, totalSellers, totalOrders] = await Promise.all([
            Book.countDocuments(),
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "seller" }),
            Order.countDocuments()
        ]);

        // 2. Aggregate Orders by Month for Chart
        const monthlyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, 
                    orders: { $sum: 1 }            
                }
            },
            { $sort: { "_id": 1 } } 
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const chartData = monthlyOrders.map(item => ({
            month: monthNames[item._id - 1],
            orders: item.orders
        }));

        // 3. Get Recent Activity
        // Populate 'user'
        const ordersFromDb = await Order.find()
            .populate("user", "username email")
            .populate("book", "title author price url")
            .sort({ createdAt: -1 })
            .limit(10);

        const recentOrders = ordersFromDb.map(order => {
            const orderObj = order.toObject();
            // If the book ref is null, the frontend will use this data from the snapshot
            if (!orderObj.book && orderObj.bookSnapshot) {
                orderObj.book = {
                    ...orderObj.bookSnapshot,
                    isDeleted: true
                };
            }
            return orderObj;
        });

        // 4. Calculate Total Revenue
        const revenueStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    // We sum the price directly from the snapshot stored in the order
                    totalRevenue: { $sum: "$bookSnapshot.price" }
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200, 
                { 
                    stats: { 
                        totalBooks, 
                        totalUsers, 
                        totalSellers, 
                        totalOrders,
                        totalRevenue: revenueStats[0]?.totalRevenue || 0 
                    },
                    chartData,
                    recentOrders
                }, 
                "Admin dashboard stats synchronized successfully"
            )
        );
        
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        throw new ApiError(500, error?.message || "Internal Server Error while fetching dashboard data");
    }
});

const getAllSellers = asyncHandler(async (req, res) => {

    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Unauthorized: Only administrators can check sellers");
    }

    // We only fetch users whose role is "seller"
    // We select specific fields to keep the response light
    const sellers = await User.find({ role: "seller" })
        .select("-password -refreshToken -cart -favorites -interestProfile")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, sellers, "Sellers fetched successfully")
    );
});

const ToggleBlacklist = asyncHandler(async (req, res) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Unauthorized: Only administrators can blacklist");
    }

    const { id } = req.params;
    console.log(id);

    // Find the user
    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Security check: Only sellers should be blacklisted via this route
    // if (user.role !== "seller") {
    //     throw new ApiError(400, "Only users with the 'seller' role can be blacklisted");
    // }

    // Toggle the boolean value
    user.isBlacklisted = !user.isBlacklisted;
    await user.save({ validateBeforeSave: false });

    const statusMessage = user.isBlacklisted 
        ? "User/seller has been blacklisted successfully" 
        : "User/seller has been removed from the blacklist";

    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                userId: user._id, 
                isBlacklisted: user.isBlacklisted 
            }, 
            statusMessage
        )
    );
});

// 4. DELETE ALL BOOKS BY SELLER
const deleteSellerBooks = asyncHandler(async (req, res) => {
    const { sellerId } = req.params;

    // 1. ADMIN CHECK: Ensure the person making the request is an Admin
    // req.user is populated by your verifyJWT middleware
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Unauthorized: Only administrators can delete a seller's inventory");
    }

    // 2. VERIFY TARGET: Check if the sellerId belongs to a real seller
    const seller = await User.findOne({ _id: sellerId, role: "seller" });
    if (!seller) {
        throw new ApiError(404, "Seller not found or the target user is not a seller");
    }

    // 3. EXECUTE: Delete all books where the 'seller' field matches sellerId
    const deleteResult = await Book.deleteMany({ seller: sellerId });

    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                deletedCount: deleteResult.deletedCount,
                sellerName: seller.username 
            }, 
            `Successfully deleted ${deleteResult.deletedCount} books belonging to ${seller.username}`
        )
    );
});

export { getAdminDashboardData, getAllSellers, ToggleBlacklist, deleteSellerBooks};