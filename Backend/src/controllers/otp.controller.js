import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.models.js";
import { sendEmail } from "../utils/email.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendSignupOTP = asyncHandler(
async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const existedUser =
        await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(
            409,
            "User already exists"
        );
    }

    const otp = Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
        email,
        otp,
        expiresAt:
            new Date(
                Date.now() +
                10 * 60 * 1000
            )
    });

    await sendEmail({
        to: email,
        subject: "Readook OTP Verification",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "OTP sent successfully"
        )
    );
});

const verifySignupOTP = asyncHandler(
async (req, res) => {

    const {
        email,
        otp
    } = req.body;

    const otpRecord =
        await OTP.findOne({ email });

    if (!otpRecord) {

        throw new ApiError(
            400,
            "OTP not found"
        );
    }

    if (
        otpRecord.expiresAt <
        new Date()
    ) {

        throw new ApiError(
            400,
            "OTP expired"
        );
    }

    if (
        otpRecord.otp !== otp
    ) {

        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "OTP verified"
        )
    );
});

const sendResetOTP = asyncHandler(
    async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const user =
        await User.findOne({ email });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const otp = Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
        email,
        otp,
        expiresAt: new Date(
            Date.now() +
            10 * 60 * 1000
        )
    });

    await sendEmail({
        to: email,
        subject: "Readook Password Reset OTP",
        text: `Your OTP is ${otp}`
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "OTP sent successfully"
        )
    );

});


const resetPassword = asyncHandler(
    async (req, res) => {

    const {
        email,
        otp,
        newPassword
    } = req.body;

    if (
        !email ||
        !otp ||
        !newPassword
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const otpRecord =
        await OTP.findOne({ email });

    if (!otpRecord) {
        throw new ApiError(
            400,
            "OTP not found"
        );
    }

    if (
        otpRecord.expiresAt <
        new Date()
    ) {

        await OTP.deleteMany({
            email
        });

        throw new ApiError(
            400,
            "OTP expired"
        );
    }

    if (
        otpRecord.otp !== otp
    ) {

        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

    const user =
        await User.findOne({ email });

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.password = newPassword;

    await user.save();

    await OTP.deleteMany({
        email
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password reset successfully"
        )
    );

});

export {
    sendSignupOTP,
    verifySignupOTP,
    sendResetOTP,
    resetPassword
}