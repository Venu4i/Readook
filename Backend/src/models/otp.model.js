import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },

        otp: {
            type: String,
            required: true
        },

        purpose: {
            type: String,
            enum: ["signup", "resetPassword"],
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const OTP = mongoose.model("OTP", otpSchema);