import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { COLLECTION_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

//console.log("GEMINI_API_KEY", process.env.GEMINI_API_KEY)
const embeddings =
    new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-embedding-2-preview"
    });

const qdrantClient =
    new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY
    });

let vectorStore = null;

export const initVectorStore = async () => {

    if (vectorStore) return vectorStore;

    vectorStore =
        await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                url: process.env.QDRANT_URL,
                apiKey: process.env.QDRANT_API_KEY,
                collectionName: COLLECTION_NAME
            }
        );

    console.log("Qdrant Connected");

    return vectorStore;
};

export const getVectorStore = () => {

    if (!vectorStore) {
        throw new Error(
            "Vector Store Not Initialized"
        );
    }

    return vectorStore;
};

const buildDocument = (book) => {

    return new Document({

        pageContent: `
Title: ${book.title}

Author: ${book.author}

Category: ${book.category}

Language: ${book.language}

Keywords:
${book.keywords?.join(", ") || ""}

Description:
${book.description}
        `,

        metadata: {
            bookId: book._id.toString(),
            //to connect like the book in mongo and qdrant 
            // is same 
            author: book.author,
            category: book.category,
            language: book.language
        }
    });
};

export const addBookVector = async (book) => {

        const vectorStore =
            getVectorStore();

        await vectorStore.addDocuments(
            [buildDocument(book)]
        );
    };

export const updateBookVector = async (book) => {

        await deleteBookVector(
            book._id.toString()
        );

        await addBookVector(book);
    };

export const deleteBookVector = async (bookId) => {

    await qdrantClient.delete(
        COLLECTION_NAME,
        {
            filter: {
                must: [
                    {
                        key: "metadata.bookId",
                        match: {
                            value: bookId
                        }
                    }
                ]
            }
        }
    );
};

export const semanticSearch =
    async (query, k = 10) => {

        const vectorStore =
            getVectorStore();

        const retriever =
            vectorStore.asRetriever(k);

        const docs =
            await retriever.invoke(query);

        return docs;
    };