import { Router } from "express";
import { forgotPswd, profile, resetPswd, signin, signUp } from "../controller/authController.js";
import { middlewareToProtect } from "../middlewares/authMidleware.js";


const router = Router();
 
router.post('/signup', signUp);
router.post('/signin', signin);
router.get("/profile", middlewareToProtect , profile);
router.post("/forgot-pswd" , forgotPswd);
router.post("/reset-pswd" , resetPswd);

export default router;