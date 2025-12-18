import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {addBook, updateBook, deleteBook,getBookbyId, getAllBooks, getRecentBooks, getAllBooksBySeller} from "../controllers/book.controller.js";
import { rateBook } from '../controllers/rating.controller.js';
import { getOptionalUser } from '../middlewares/getOptionalUser.js';


const router = Router() 

router.route("/add-book").post( 
    verifyJWT, 
    addBook
)
router.route("/update-book/:id").patch( 
    verifyJWT, 
    updateBook
)
router.route("/delete-book/:id").delete(
    verifyJWT,
    deleteBook
)
router.route("/get-book-details/:id").get(
    getBookbyId
)
router.route("/get-all-books").get(
    getOptionalUser,
    getAllBooks
)
router.route("/get-recent-books").get(
    getRecentBooks
)
router.route("/get-added-books").get(
    verifyJWT,
    getAllBooksBySeller
)
router.route("/rate").post(
    verifyJWT,
    rateBook
)
export default router