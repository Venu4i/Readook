import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose, { trusted } from "mongoose";
import { OTP } from "../models/otp.model.js";
import { sendEmail } from "../utils/email.js";

const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        //console.log("shuru to hua")
        const user = await User.findById(userId)
        if(!user){
            console.log("user ni mila yrr")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save ({validateBeforeSave : false})
        return { accessToken, refreshToken }

    } catch (error) {
        console.log("messedup!")
        throw new ApiError (500 , "Error during generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //console.log("📥 Incoming register request:", req.body); 

    const { username, email, password, role, otp } = req.body;

    if ([username, email, password, role, otp].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All fields are required.");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const otpRecord =
        await OTP.findOne({ email });

    if (!otpRecord) {
        throw new ApiError(
            400,
            "Please verify your email first"
        );
    }

    if (
        otpRecord.expiresAt <
        new Date()
    ) {
        await OTP.deleteMany({ email });

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

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        role: role || "user"
    });

     await OTP.deleteMany({
        email
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    if (!createdUser) {
        throw new ApiError(500,"Internal Server Error");
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser,"User registered successfully")
    );
});


const loginUser = asyncHandler (async (req, res) => {
    ////fetch userdata
    //find through username/email
    //password check
    //generate access and refresh tokens
    //send cookies

    const{identifier, password} = req.body;

    if(! (identifier)) {
        throw new ApiError (400, "Username or email is required")
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
        $or: [
            { username: normalizedIdentifier },
            { email: normalizedIdentifier }
        ]
    });

    if(!user){
        throw new ApiError (404 ,"User does not exist",)
    }

    if (user && user.role === "seller" && user.isBlacklisted) {
    throw new ApiError(403, "Your account has been blacklisted due to complaints. Access denied.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401, "Invalid user creddentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200, {user: loggedinUser,accessToken, refreshToken}, "User logged in successfully")
    )
})

const logoutUser = asyncHandler (async (req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,{
            $unset: {
                refreshToken: 1 //remove tokens from docu
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse (200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler (async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Please Login to Continue.")
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        // console.log({
        // accessToken,
        // refreshToken
        // });
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: refreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getUser = asyncHandler( async(req, res,) => {
    return res.status(200).json( 
        new ApiResponse (
        200, req.user,"User details fetched"
        )
    )
})

const updateAddress = asyncHandler (async (req,res) => {
    const {address} = req.body;
    if(!address){
        throw new ApiError(400, "Address is required")
    }
    const updateduser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            address
        },{new: true}
    ).select ("-password -refreshToken")

    return res.status(200)
    .json(new ApiResponse(200, updateduser, "Address updated successfully"))
})

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({
        email,
        purpose: "resetPassword"
    });

    await OTP.create({
        email,
        otp,
        purpose: "resetPassword",
        expiresAt:
            new Date(
                Date.now() +
                10 * 60 * 1000
            )
    });

    await sendEmail({
        to: email,
        subject: "Readook Password Reset OTP",
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "OTP sent successfully"
        )
    );
});

const resetPassword = asyncHandler(async (req, res) => {

    const {
        email,
        otp,
        newPassword
    } = req.body;

    const otpRecord =
        await OTP.findOne({
            email,
            otp,
            purpose: "resetPassword"
        });

    if (!otpRecord) {
        throw new ApiError(
            400,
            "Invalid OTP"
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

    const user =
        await User.findOne({
            email
        });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.password = newPassword;

    await user.save();

    await OTP.deleteOne({
        _id: otpRecord._id
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password updated successfully"
        )
    );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    generateAccessAndRefreshTokens,
    getUser,
    updateAddress,
    forgotPassword,
    resetPassword
}