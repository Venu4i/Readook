import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {placeOrder, getUserOrders, getAllOrders, updateStatus} from "../controllers/order.controller.js"

const router = Router()

router.route("/place-order").post(
    verifyJWT,
    placeOrder
)
router.route("/get-orders").get(
    verifyJWT,
    getUserOrders
)
router.route("/get-all-orders").get(
    verifyJWT,
    getAllOrders
)
router.route("/update-status").patch(
    verifyJWT,
    updateStatus
)

export default router