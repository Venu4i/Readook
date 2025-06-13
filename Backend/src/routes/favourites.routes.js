import { Router } from "express"
//import User from "../models/user.model.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {addToFavourites} from "../controllers/favourites.controller.js"

const router = Router()

router.route("/add-to-favourites/:id").patch(
    verifyJWT,
    addToFavourites
)

export default router