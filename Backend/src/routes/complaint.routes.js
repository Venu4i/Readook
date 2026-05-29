import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    reportSeller,
    getAllComplaints,
    updateComplaintStatus
} from "../controllers/complaint.controller.js";

const router = Router();

router.route("/reportSeller").post(
    verifyJWT,
    reportSeller
);

router.route("/getAllComplaints").get(
    verifyJWT,
    getAllComplaints
);


router.route("/updateComplaintStatus/:id").patch(
    verifyJWT,
    updateComplaintStatus
);

export default router;