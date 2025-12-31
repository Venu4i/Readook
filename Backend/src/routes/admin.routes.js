import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { getAdminDashboardData, getAllSellers, ToggleBlacklist, deleteSellerBooks} from '../controllers/admin.controller.js';



const router = Router() 

router.route("/get-stats").get(
    verifyJWT,
    getAdminDashboardData
)

router.route("/get-sellers").get(
    verifyJWT,
    getAllSellers
)

router.route("/toggle-blacklist/:id").patch(
    verifyJWT,
    ToggleBlacklist
)

router.route("/delete-sellerbooks/:sellerId").delete(
    verifyJWT,
    deleteSellerBooks
)

export default router