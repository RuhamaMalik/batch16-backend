import { Router } from "express";
import { authorize, middlewareToProtect } from "../middlewares/authMidleware.js";
import { getAdminBlogs } from "../controller/adminController.js";

const router = Router();

router.get('/blog/all', middlewareToProtect, authorize('admin'), getAdminBlogs);

export default router;