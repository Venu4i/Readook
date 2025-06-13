import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {addBook, updateBook, deleteBook} from "../controllers/book.controller.js";


const router = Router() 

router.route("/add-book").post( 
    verifyJWT, 
    addBook
)
router.route("/update-book").patch( 
    verifyJWT, 
    updateBook
)
router.route("/delete-book/:id").delete(
    verifyJWT,
    deleteBook
)

export default router