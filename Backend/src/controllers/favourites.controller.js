import {User} from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const addToFavourites = asyncHandler( async (req,_) => {
    try {
        const bookId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
          throw new ApiError(400, "Invalid book ID format");
        }

        // Check if user exists and book exists
        const user = await User.findById(req.user?._id)
        if(!user){
            throw new ApiError (404, "User not found")
        }
    
        const favbook =  await Book.findById (bookId)
        if(!favbook){
            throw new ApiError (404, "Book not found")
        }

        const isBookFavourite = user.favorites
            .map(String)
            .includes(bookId.toString());
        
        if(isBookFavourite){
            throw new ApiError (400, "Book is already in favourites")
        }

        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push: { favorites: bookId }
            },
            { new: true }
        )

        return new ApiResponse(200, "Book added to favourites successfully", favbook);
    }
     catch (error) {
        throw new ApiError (500, error? error : "Internal server Error")
    }



})

export {
    addToFavourites
}