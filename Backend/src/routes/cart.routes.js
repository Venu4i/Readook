import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, deleteFromCart , getCart} from "../controllers/cart.controller.js";

const router = Router()

router.route("/add-to-cart/:id").post(
    verifyJWT,
    addToCart
)
router.route("/delete-from-cart/:id").delete(
    verifyJWT,
    deleteFromCart
)
router.route("/get-cart/").get(
    verifyJWT,
    getCart
)

export default router