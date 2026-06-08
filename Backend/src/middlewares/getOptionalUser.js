import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const getOptionalUser = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token, move to the controller as a guest
        if (!token) {
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_REQUEST_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If user exists in DB, attach it to the request
        if (user) {
            req.user = user;
        }
        
        next();
    } catch (error) {
        // If token is expired or invalid, we still call next() 
        // so the guest view can still be seen.
        console.log("Optional Auth Info: Invalid or expired token");
        next();
    }
});