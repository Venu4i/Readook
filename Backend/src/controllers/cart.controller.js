import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {asyncHandler} from '../utils/asyncHandler.js';
import {User} from '../models/user.models.js';
import { Book } from '../models/book.model.js';


const addToCart = asyncHandler(async (req, res) => {
    try{
        const bookId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw new ApiError(400, "Invalid book ID format");
        }
        
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        const book = await Book.findById(bookId);
        if (!book) {
            throw new ApiError(404, "Book not found");
        }
        
        user.cart.push(bookId);
        await user.save();
        
        return res
            .status(200)
            .json(new ApiResponse(200, book, "Book added to cart successfully"))
    }
    catch (error) {
        throw new ApiError (500, error ? error : "Internal Server Error")
    }
})

const deleteFromCart = asyncHandler(async (req,res) => {
    try {
        const bookId = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                throw new ApiError(400, "Invalid book ID format");
            }
            const user = await User.findById(req.user?._id)
            if(!user){
                throw new ApiError (404, "User not found")
            }
            const book = await Book.findById(bookId)
            if(!book){
                throw new ApiError (404, "Book not found")
            }
            const isInCart = user.cart.some( //checking if the book is in the cart
                bookInCartId => bookInCartId.toString() === bookId
            )
            if(!isInCart){
                throw new ApiError(400, "Book is not in cart")
            }
            user.cart = user.cart.filter( //removing the book from the cart
                bookInCartId => bookInCartId.toString() !== bookId
            )
            await user.save();
            return res
                .status(200)
                .json(new ApiResponse(200, book, "Book removed from cart successfully"))
    } 
    catch (error) {
        throw new ApiError (500, error ? error : "Internal Server Error")
    }
})


const getCart = asyncHandler(async( req, res) =>{
    const user = await User.findById(req.user?._id).populate('cart')
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const booksInCart = user.cart;
    //  const booksInCart = await Book.find({  ..if populate is not used..
    //     _id: { $in: user.cart }
    // });
    if(booksInCart.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
    }
    return res.status(200).json(new ApiResponse(200, booksInCart, "books in cart retrieved successfully"));
})

export {
    addToCart,
    deleteFromCart,
    getCart
}