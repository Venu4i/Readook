import "dotenv/config";
import mongoose from "mongoose";
import { Book } from "../src/models/book.model.js";
import { DB_name }from "../src/constants.js";

await mongoose.connect(`${process.env.MongoDB_URI}/${DB_name}`);

const books = await Book.find({
    $or: [
        { keywords: { $exists: false } },
        { keywords: { $size: 0 } }
    ]
});

console.log(`Found ${books.length} books to update`);

for (const book of books) {

    try {

        const titleWords = (book.title || "")
            .toLowerCase()
            .split(/\s+/);

        const authorWords = (book.author || "")
            .toLowerCase()
            .split(/\s+/);

        const categoryWords = (book.category || "")
            .toLowerCase()
            .split(/\s+/);

        const languageWords = (book.language || "")
            .toLowerCase()
            .split(/\s+/);

        const descriptionWords = (book.description || "")
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(word => word.length > 4);

        const keywords = [
            ...titleWords,
            ...authorWords,
            ...categoryWords,
            ...languageWords,
            ...descriptionWords.slice(0, 15)
        ];

        book.keywords = [
            ...new Set(
                keywords.filter(
                    word =>
                        word &&
                        word.length > 2
                )
            )
        ];

        await book.save();

        console.log(`✅ Updated: ${book.title}`);

    } catch (error) {

        console.error(`❌ Failed: ${book.title}`);
        console.error(error.message);
    }
}

await mongoose.disconnect();

console.log("🎉 All books processed");