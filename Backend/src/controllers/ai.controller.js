import model from "../utils/ai.js";
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

export { generateDescription };