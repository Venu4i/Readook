import { Book } from '../models/book.model.js';

const calculateSimilarity = (userVector, bookVector) => {
    const dotProduct = userVector.reduce((sum, val, i) => sum + val * (bookVector[i] || 0), 0);
    const magA = Math.sqrt(userVector.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(bookVector.reduce((sum, val) => sum + val * val, 0));
    return (magA === 0 || magB === 0) ? 0 : dotProduct / (magA * magB);
};

export const getRecommendedBooks = async (user) => {
    // 1. Fetch books (excluding favorites)
    const allBooks = await Book.find({ _id: { $nin: user.favorites } });
    
    // Get categories from the user's interest Map
    const categories = Array.from(user.interestProfile.categories.keys());
    
    if (categories.length === 0) {
        return allBooks
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);
    }

    // 2. Build User Vector
    const userVector = categories.map(cat => user.interestProfile.categories.get(cat) || 0);

    // 3. Score books
    const scoredBooks = allBooks.map(book => {
        const bookVector = categories.map(cat => (book.category === cat ? 1 : 0));
        
        // Base similarity (0 to 1)
        const similarity = calculateSimilarity(userVector, bookVector);
        
        // BOOSTER: If similarity is > 0, we multiply it by the user's weight 
        // for that specific category to ensure high interest = top position.
        const interestWeight = user.interestProfile.categories.get(book.category) || 0;
        
        // Final Score: (Similarity * 10) + (Interest Weight * 2) + (Book Rating)
        const totalScore = (similarity * 10) + (interestWeight * 5) + (book.rating || 0);

        return {
            ...book._doc,
            score: totalScore
        };
    });

    // 4. Sort by our custom score
    return scoredBooks
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
};