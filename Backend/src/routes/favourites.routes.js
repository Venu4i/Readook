import { Router } from "express"
//import User from "../models/user.model.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {addToFavourites, deleteFromfavourites, getFavourites} from "../controllers/favourites.controller.js"

const router = Router()

router.route("/add-to-favourites/:id").patch(
    verifyJWT,
    addToFavourites
)
router.route("/delete-from-favourites/:id").patch(
    verifyJWT,
    deleteFromfavourites
)
router.route("/get-favourites").get(
    verifyJWT,
    getFavourites
)

export default router