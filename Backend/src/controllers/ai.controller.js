import model from "../utils/ai.js";
import {Book} from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateDescription = asyncHandler(async (req, res) => {

    const { title, author } = req.body;

    if (!title || !author) {
        throw new ApiError(400, "Title and author are required");
    }

    const prompt = `
Write a professional marketplace description and also give the category for this book.

Title: ${title}
Author: ${author}

Keep description between 50 and 120 words.
Return only in the format - {
  "description": "....",
  "category": "..",
}.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    const data = JSON.parse(cleaned);

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            "Generated successfully"
        )
    );
});

const generateKeywords = async (
    title,
    author,
    description,
    category ) => {
    try {

        const prompt = `
        Generate 8-12 searchable keywords for this book including the author, title and category.

        Title: ${title}
        Author: ${author}
        Category: ${category}
        Description: ${description}

        Return ONLY JSON.

        {
            "keywords": [
                "keyword1",
                "keyword2",
                "keyword3"
            ]
        }
        `;

        const result = await model.generateContent(prompt);

        const text = result.response
            .text()
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(text);

        return data.keywords || [];

    } catch (error) {

        console.error(error);

        return [];
    }
};

const discoverBooks = async (req, res) => {
    try {
        if (!req.user?._id) {
            throw new ApiError(
                401,
                "Please login to use AI Discovery"
            );
        }

        const { query } = req.body;

        if (!query?.trim()) {
            throw new ApiError(400, "Query is required");
        }

        const prompt = `
Analyze this book search query:

"${query}"

Return the response, in which keywords must be able to find books around the query, also consider spelling corrections if possible in author's name or such things , ONLY valid JSON:

{
  "language": "",
  "author": "",
  "category": "",
  "keywords": []
}
`;

        const result = await model.generateContent(prompt);

        const text = result.response
            .text()
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(text);

        const language = parsed.language?.trim();
        const author = parsed.author?.trim();
        const category = parsed.category?.trim();
        const keywords = parsed.keywords || [];

        let books = await Book.find({});

        // Layer 1: Language
        if (language) {

            const filtered = books.filter(book =>
                book.language?.toLowerCase()
                    .includes(language.toLowerCase())
            );

            if (filtered.length > 0) {
                books = filtered;
            }
        }

        // Layer 2: Author
        if (author) {

            const filtered = books.filter(book =>
                book.author?.toLowerCase()
                    .includes(author.toLowerCase())
            );

            if (filtered.length > 0) {
                books = filtered;
            }
        }

        // Layer 3: Category
        if (category) {

            const filtered = books.filter(book =>
                book.category?.toLowerCase()
                    .includes(category.toLowerCase())
            );

            if (filtered.length > 0) {
                books = filtered;
            }
        }

        // Ranking inside remaining books
        const rankedBooks = books
            .map(book => {

                let score = 0;

                keywords.forEach(keyword => {

                    const lowerKeyword = keyword.toLowerCase();

                    if (
                        book.keywords?.some(
                            k => k.toLowerCase() === lowerKeyword
                        )
                    ) {
                        score += 10;
                    }

                    if (
                        book.title?.toLowerCase()
                            .includes(lowerKeyword)
                    ) {
                        score += 5;
                    }

                    if (
                        book.description?.toLowerCase()
                            .includes(lowerKeyword)
                    ) {
                        score += 3;
                    }
                });

                return {
                    ...book.toObject(),
                    matchScore: score
                };
            })
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 20);

        return res.status(200).json({
            success: true,
            extractedData: {
                language,
                author,
                category,
                keywords
            },
            books: rankedBooks
        });

    } catch (error) {

        console.error("AI Discovery Error:", error);

        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            500,
            "AI discovery failed"
        );
    }
};

export { generateDescription ,
        generateKeywords,
        discoverBooks
};