// import jwt from 'jsonwebtoken';
import {User} from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const addBook = asyncHandler( async(req,res) =>{
    //get book details
    //save book

    try {
        const user= await User.findById(req.user?._id)
        if(user.role !== "admin"){
            throw new ApiError (403, "Only admins can add books` ")
        }
        const book = new Book(
            {
                url : req.body.url,
                title : req.body.title,
                author:req.body.author,
                price: req.body.price,
                description: req.body.description,
                language: req.body.language,
                seller : req.user?._id //linking book to admin
            }
        )
        await book.save();
        res.status(200).json( new ApiResponse(200, "book added successfully", book))
    }
     catch (error) {
        console.error("Error adding book:", error);
        throw new ApiError (500, "Internal Server Error")
    }
})

const updateBook = asyncHandler (async (req, res) => {
    try {
        const user = await User.findById(req.user?._id)
        if(user.role !== "admin"){
            throw new ApiError (403, "Only admins can update books")
        }
        const BookId = req.params.id;
        const updatedbook = await Book.findByIdAndUpdate(BookId, {
            url : req.body.url,
                    title : req.body.title,
                    author:req.body.author,
                    price: req.body.price,
                    description: req.body.description,
                    language: req.body.language,
        })
        res.status(200).json(new ApiResponse (200, "Book details updated successfully", updatedbook))
    } catch (error) {
        throw new ApiError (500, error? error : "Internal Server error")
    }
    
})

const deleteBook = asyncHandler (async (req,res) => {
    try {
        const user = await User.findById(req.user?._id) //admin check
        if(user.role !== "admin"){
            throw new ApiError (403, "Only admins can delete books")
        }
        console.log("User found: ",user)
        const BookId = req.params.id //book check
        if(!BookId){
            throw new ApiError (404, "Book not found")
        }
        const targetBook = await Book.findById(BookId)
        await Book.findByIdAndDelete(BookId)
        res.status(200).json(new ApiResponse (200, "Book deleted successfully", targetBook))

    } catch (error) {
        throw new ApiError (500, error? error : "Internal Server Error")
    }

})

const getAllBooks  = asyncHandler (async (_,res) => {
    try {
        const Books = await Book.find().sort({createdAt : 1})
        return res.json( new ApiResponse (200, "Books fetched successfully", Books))
    } 
    catch (error) {
        throw new ApiError (500, error? error : "Internal Server Error")
    }
})

const getRecentBooks = asyncHandler (async (req, res) => {
    try {
        const Books = await Book.find().sort({createdAt : 1}).limit(4)
        return res.json( new ApiResponse (200, "Books fetched successfully", Books))
    } 
    catch (error) {
        throw new ApiError (500, error? error : "Internal Server Error")
    }
})



export {
    addBook,
    updateBook,
    deleteBook,
    getAllBooks,
    getRecentBooks
}