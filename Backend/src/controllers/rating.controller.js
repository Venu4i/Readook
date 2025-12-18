import {User} from '../models/user.models.js';
import { Book } from '../models/book.model.js';
import { Order } from '../models/order.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const rateBook = asyncHandler(async (req, res) => {
    const { bookId, orderId, stars } = req.body;

    // 1. Validate Input
    if (!stars || stars < 1 || stars > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5 stars");
    }

    // 2. Find the specific order
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
        throw new ApiError(404, "Order not found or unauthorized");
    }

    // 3. Logic: Case-insensitive status check
    // Your DB has "delivered", your code had "Delivered"
    if (order.status.toLowerCase() !== "delivered") {
        throw new ApiError(400, `Current status is ${order.status}. You can only rate after delivery.`);
    }

    if (order.isRated) {
        throw new ApiError(400, "You have already rated this order.");
    }

    const book = await Book.findById(bookId);
    if (!book) throw new ApiError(404, "Book not found");

    // 4. Update Book Global Rating
    book.totalStars = (book.totalStars || 0) + Number(stars);
    book.numberOfReviews = (book.numberOfReviews || 0) + 1;
    book.rating = parseFloat((book.totalStars / book.numberOfReviews).toFixed(1));
    await book.save();

    // 5. Update Order
    order.isRated = true;
    order.ratingGiven = stars;
    await order.save();

    // 6. Update User ML Interest Profile
    if (stars >= 4) {
        const user = await User.findById(req.user._id);
        
        // Safety check for Map initialization
        if (!user.interestProfile) {
            user.interestProfile = { categories: {}, authors: {} };
        }

        const currentWeight = user.interestProfile.categories.get(book.category) || 0;
        user.interestProfile.categories.set(book.category, currentWeight + 2);
        
        // Mark modified is required for Mongoose Maps sometimes
        user.markModified('interestProfile'); 
        await user.save();
    }

    return res.status(200).json(
        new ApiResponse(200, { newAverageRating: book.rating }, "Rating submitted successfully")
    );
});