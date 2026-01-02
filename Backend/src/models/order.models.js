import mongoose, {model, Schema} from "mongoose";

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookSnapshot: {
        title: String,
        price: Number,
        image: String,
        sellerName: String
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
    isRated: {
        type: Boolean,
        default: false
    },
    ratingGiven: {
        type: Number,
        default: 0
    },
    status:{
        type: String,
        default: "Order Placed",
        enum : ["Order Placed","out for delivery","delivered", "Cancelled"],
    },
    deliveryCode: {
        type: String,
        required: true
        // generate this during order placement
    }
},
{
    timestamps : true 
});

export const Order = mongoose.model("Order", orderSchema)