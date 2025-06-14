import mongoose, {model, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {User} from "./user.models.js";
import {Book} from "./book.model.js";

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // seller/admin
    required: true
   },
    status:{
        type: String,
        default: "Order Placed",
        enum : ["Order Placed","out for delivery","delivered", "Cancelled"],
    },
},
{
    timestamps : true 
});

export const Order = mongoose.model("Order", orderSchema)