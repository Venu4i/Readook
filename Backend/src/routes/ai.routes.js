import { Router } from "express";

import {
    generateDescription,
    generateKeywords,
    discoverBooks, 
    SemanticDiscovery
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

router.route("/generateKeywords").post(
    verifyJWT,
    generateKeywords
);

router.route("/discoverBooks").post(
    verifyJWT,
    discoverBooks
);

router.route("/semanticDiscovery").post(
    verifyJWT,
    SemanticDiscovery
);

export default router;