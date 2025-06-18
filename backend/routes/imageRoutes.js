import express from "express";
import { removeImage, saveImage, uploadImage } from "../controllers/imageController.js";


const router = express.Router();

// Upload image to local 'uploads/' folder
router.post("/upload", uploadImage);

// Upload image to Cloudinary
router.post("/cloudinary",saveImage);

// Remove local file
router.post("/remove",removeImage);

export default router;
