import {Router} from 'express';
import {sendSignupOTP, verifySignupOTP, sendResetOTP, resetPassword} from '../controllers/otp.controller.js';

const router = Router()

router.route("/send-otp").post(
    sendSignupOTP
)
router.route("/verify-otp").post(
    verifySignupOTP
)
router.route("/send-reset-otp").post(
    sendResetOTP
)
router.route("/reset-password").post(
    resetPassword
)

export default router