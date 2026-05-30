import { Router } from "express";

import {
    generateDescription,
}
from "../controllers/ai.controller.js";

import {
    verifyJWT,
}
from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/generateDescription").post(
    verifyJWT,
    generateDescription
);

export default router;