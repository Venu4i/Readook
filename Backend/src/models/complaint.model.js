import mongoose, { Schema } from "mongoose";

const ComplaintSchema = new Schema(
  {
    reportedSeller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model("Complaint", ComplaintSchema);