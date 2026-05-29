import { Complaint } from "../models/complaint.model.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reportSeller = asyncHandler(async (req, res) => {
    try {

        const reportedBy = req.user?._id;

        const {
            reportedSeller,
            orderId,
            bookId,
            reason
        } = req.body;

        // Basic validation
        if (!reportedSeller || !orderId || !reason) {
            throw new ApiError(400, "All required fields must be provided");
        }

        // Check if seller exists
        const seller = await User.findById(reportedSeller);

        if (!seller) {
            throw new ApiError(404, "Seller not found");
        }

        // Check if order exists
        const order = await Order.findById(orderId);

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        // Prevent self-reporting
        if (reportedSeller.toString() === reportedBy.toString()) {
            throw new ApiError(400, "You cannot report yourself");
        }

        // Prevent duplicate reports
        const existingReport = await Complaint.findOne({
            reportedBy,
            orderId,
        });

        if (existingReport) {
            throw new ApiError(
                400,
                "You have already reported this seller for this order"
            );
        }

        // Create report
        const report = await Complaint.create({
            reportedSeller,
            reportedBy,
            orderId,
            bookId,
            reason,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    report,
                    "Seller reported successfully"
                )
            );

    } catch (error) {
        console.error("Report Seller Error:", error);

        throw new ApiError(
            500,
            error?.message || "Internal Server Error"
        );
    }
});

const getAllComplaints = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user?._id);

        // Admin only
        if (user.role !== "admin") {
            throw new ApiError(
                403,
                "Only admins can access reports"
            );
        }

        const reports = await Complaint.find()
            .populate("reportedSeller", "username email")
            .populate("reportedBy", "username email")
            .populate("bookId", "title")
            .sort({ createdAt: -1 });

        return res.json(
            new ApiResponse(
                200,
                reports,
                "Reports Complaints successfully"
            )
        );

    } catch (error) {
        console.error("Get Complaints Error:", error);

        throw new ApiError(
            500,
            error?.message || "Internal Server Error"
        );
    }
});

const updateComplaintStatus = asyncHandler(async (req, res) => {

    try {

        const user = await User.findById(req.user?._id);

        if (user.role !== "admin") {
            throw new ApiError(
                403,
                "Only admins can update complaint status"
            );
        }

        const { id } = req.params;

        const complaint = await Complaint.findById(id);

        if (!complaint) {
            throw new ApiError(404, "Complaint not found");
        }

        const statusFlow = {
            pending: "reviewed",
            reviewed: "resolved",
            resolved: "pending",
        };

        complaint.status = statusFlow[complaint.status];

        await complaint.save();

        return res.json(
            new ApiResponse(
                200,
                complaint,
                "Complaint status updated successfully"
            )
        );

    } catch (error) {

        console.error(error);

        throw new ApiError(
            500,
            error?.message || "Internal Server Error"
        );
    }
});

export {
    reportSeller,
    getAllComplaints,
    updateComplaintStatus
};