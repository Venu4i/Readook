import mongoose , {model, Schema} from "mongoose";

const bookSchema = new Schema ({
    url:{
        type : String,
        required: true,
    },
    title:{
        type : String,
        required: true,
    },
    author:{
        type : String,
        required: true,
    },
    price:{
        type : Number,
        required: true,
    },
    quantity:{
        type : Number,
        default: 0
    },
    description:{
        type : String,
        required: true,
    },
    language:{
        type : String,
        required: true,
    },
    totalStars:{
        type: Number,
        default : 0,
    },
    numberOfReviews:{
        type: Number,
        default : 0,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    category: {
        type: String,
        required: true
    },
    seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming admin is stored in the same User model
    required: true
  },
},
{
    timestamps: true
});

export const Book = mongoose.model("Book", bookSchema);