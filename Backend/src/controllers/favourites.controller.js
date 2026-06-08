import { User } from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const addToFavourites = asyncHandler(async (req, res) => {
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

  const isAlreadyFavourite = user.favorites.some(
    favId => favId.toString() === bookId
  );

  if (isAlreadyFavourite) {
    throw new ApiError(400, "Book is already in favourites");
  }

  try {
    user.favorites.push(bookId);
  // Normalize the category name
const categoryKey = book.category.trim(); // "Self-Help"

const currentWeight = user.interestProfile.categories.get(categoryKey) || 0;
user.interestProfile.categories.set(categoryKey, currentWeight + 2);

    // Update Author Weights
    const currentAuthWeight = user.interestProfile.authors.get(book.author) || 0;
    user.interestProfile.authors.set(book.author, currentAuthWeight + 1);


  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book added to favourites successfully"));
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const deleteFromfavourites = asyncHandler(async (req, res) => {
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
    const isFavourite = user.favorites.some(
        favId => favId.toString() === bookId
    )
    if(!isFavourite){
        throw new ApiError(400, "Book is not in favourites")
    }
    user.favorites = user.favorites.filter(
        favId => favId.toString() !== bookId
    )
    await user.save();
    return res
        .status(200)
        .json(new ApiResponse(200, book, "Book removed from favourites successfully"));
})

const getFavourites = asyncHandler(async( req, res) =>{
    const user = await User.findById(req.user?._id).populate('favorites')
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const favouriteBooks = user.favorites;
    //  const favouriteBooks = await Book.find({  ..if populate is not used..
    //     _id: { $in: user.favorites }
    // });
    if(favouriteBooks.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "No favourite books found"));
    }
    return res.status(200).json(new ApiResponse(200, favouriteBooks, "Favourite books retrieved successfully"));
})

export { 
    addToFavourites,
    deleteFromfavourites,
    getFavourites
 };
