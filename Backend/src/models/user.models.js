import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true,
    },
    // address: {
    //     type: String,
    // },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    favorites: [{
        type: mongoose.Types.ObjectId,
        ref: "Book",
    }],
    cart: [{
        type: mongoose.Types.ObjectId,
        ref: "Book",
    }],
    orders: [{
        type: mongoose.Types.ObjectId,
        ref: "Order",
    }],
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true 
});

// // Password hashing
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// // Method to check password
// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

// // Method to generate access token
// userSchema.methods.generateAccessToken = function () {
//     return jwt.sign(
//         { _id: this._id, email: this.email, role: this.role },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "15m" }
//     );
// };

// // Method to generate refresh token
// userSchema.methods.generateRefreshToken = function () {
//     return jwt.sign(
//         { _id: this._id },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: "7d" }
//     );
// };

 export const User = mongoose.model("User", userSchema);
