import mongoose, {model, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const orderSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    book:{
        type: Schema.Types.ObjectId,
        ref: "Book"
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

export const Order = mongoose.model("Order", orderSchema0)