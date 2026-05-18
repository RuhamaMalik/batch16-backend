import { Router } from "express";

import { middlewareToProtect } from "../middlewares/authMidleware.js";
import { createblog } from "../controller/Blogcontroller.js";
import multer from 'multer'

const blogRouter = Router();
 

const storage = multer.memoryStorage()
const upload =multer({
  storage:storage
})
blogRouter.post('/create', middlewareToProtect,upload.single('image'),createblog);


export default blogRouter;