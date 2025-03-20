import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { removeImage, saveImage, uploadImage } from "../controllers/imageController.js";


const router = express.Router();

// Upload image to local 'uploads/' folder
router.post("/upload", upload.single("image"),uploadImage);

// Upload image to Cloudinary
router.post("/cloudinary", upload.single("image"),saveImage);

// Remove local file
router.post("/remove",removeImage);

export default router;
