import {Router} from 'express';
import {loginUser,logoutUser,registerUser,refreshAccessToken,getUser,updateAddress,changePassword} from '../controllers/user.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/register").post(
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(
    verifyJWT, 
    logoutUser
)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(
    verifyJWT,
    changePassword
)
router.route("/getuser").get(verifyJWT, getUser)
router.route("/update-address").patch(verifyJWT, updateAddress)

export default router