// import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { getRecommendedBooks } from '../utils/recommendation.js';

const addBook = asyncHandler( async(req,res) =>{
    //get book details
    //save book

    try {
        const user= await User.findById(req.user?._id)
        if(user.role !== "admin" && user.role !== "seller"){
            throw new ApiError (403, "Only admins/sellers can add books ")
        }
        const book = new Book(
            {
                url : req.body.url,
                title : req.body.title,
                author:req.body.author,
                price: req.body.price,
                description: req.body.description,
                language: req.body.language,
                seller : req.user?._id ,//linking book to seller
                quantity:req.body.quantity,
                category : req.body.category,
            }
        )
        await book.save();
        res.status(200).json( new ApiResponse(200, book, "book added successfully"))
    }
     catch (error) {
        console.error("Error adding book:", error);
        throw new ApiError (500, "Internal Server Error")
    }
})

const updateBook = asyncHandler (async (req, res) => {
    try {
        const user = await User.findById(req.user?._id)
        const BookId = req.params.id;
        const book = await Book.findById(BookId);
        //console.log(book.seller)
        //console.log(req.user._id)
        
        if (user.role !== "admin" && book.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this book");
}
        
        const updatedbook = await Book.findByIdAndUpdate(BookId, {
            url : req.body.url,
                    title : req.body.title,
                    author:req.body.author,
                    price: req.body.price,
                    description: req.body.description,
                    language: req.body.language,
        })
        res.status(200).json(new ApiResponse (200, updatedbook, "Book details updated successfully"))
    } catch (error) {
        throw new ApiError (500, error? error : "Internal Server error")
    }
    
})

const deleteBook = asyncHandler (async (req,res) => {
    try {
        const user = await User.findById(req.user?._id) //admin check
        const BookId = req.params.id //book check
        if(!BookId){
            throw new ApiError (404, "Book not found")
        }
        const targetBook = await Book.findById(BookId)
        if(user.role !== "admin" && targetBook.seller.toString() !== req.user._id.toString()){
            throw new ApiError (403, "Only admins/seller can delete books")
        }
        //console.log("User found: ",user)
        
        await Book.findByIdAndDelete(BookId)
        res.status(200).json(new ApiResponse (200, "Book deleted successfully", targetBook))

    } catch (error) {
        throw new ApiError (500, error? error : "Internal Server Error")
    }

})

const getAllBooks = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        let finalBooks = [];

        console.log("Entered getAllBooks")

        // 1. Try to get personalized recommendations if user is logged in
        if (userId) {
            const user = await User.findById(userId);
            
            // Note: Mongoose Maps use .size to check length
            if (user && user.interestProfile?.categories?.size > 0) {
                const recommended = await getRecommendedBooks(user);
                
                // Get IDs of recommended books to exclude them from the "others" list
                const recommendedIds = recommended.map(b => b._id.toString());

                // Find other books, excluding favorites and already recommended ones
                const others = await Book.find({ 
                    _id: { $nin: [...user.favorites, ...recommendedIds] } 
                }).sort({ rating: -1, createdAt: -1 });

                // Merge: Recommendations always come first
                finalBooks = [...recommended, ...others];

                console.log("--- Recommendation Debug ---");
                console.log("User Categories:", user.interestProfile.categories);
                console.log("First Book Score:", finalBooks[0]?.title, "Score:", finalBooks[0]?.score);
                console.log("Total Books being sent:", finalBooks.length);
            }
        }

        // 2. Cold Start / Guest User / No Interests yet
        if (finalBooks.length === 0) {
            finalBooks = await Book.find()
                .sort({ rating: -1, createdAt: -1 });
        }

        

        return res.json(new ApiResponse(200, finalBooks, "Books fetched successfully"));
    } catch (error) {
        console.error("Error in getAllBooks:", error);
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

const fetchRecommendations = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) throw new ApiError(404, "User not found");

        const recommendations = await getRecommendedBooks(user);
        return res.json(new ApiResponse(200, recommendations, "Recommendations fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});

const getRecentBooks = asyncHandler (async (req, res) => {
    try {
        const Books = await Book.find().sort({createdAt : 1}).limit(4)
        return res.json( new ApiResponse (200, Books, "Books fetched successfully"))
    } 
    catch (error) {
        throw new ApiError (500, error? error : "Internal Server Error")
    }
})

const getBookbyId = asyncHandler (async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            throw new ApiError (404, "Book not found")
        }
        const book = await Book.findById(id);
        res.status(200).json( new ApiResponse(200, book, "Book details fetched successfully"));
    }
    catch(error){
        throw new ApiError (500, error? error: "Internal Server Error")
    }
})

const getAllBooksBySeller = asyncHandler(async (req, res) => {
  try {
    const sellerId = req.user?._id;

    if (!sellerId) {
      throw new ApiError(401, "Unauthorized - seller ID not found");
    }

    const books = await Book.find({ seller: sellerId }).sort({ createdAt: 1 });

    return res.json(new ApiResponse(200, books, "Books fetched successfully"));
  } catch (error) {
    console.error("getAllBooksBySeller error:", error);
    throw new ApiError(500, error?.message || "Internal Server Error");
  }
});

export {
    addBook,
    updateBook,
    deleteBook,
    getBookbyId,
    getAllBooks,
    getRecentBooks,
    getAllBooksBySeller,
    fetchRecommendations
}