import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filePath: req.file.path,
  });
};

export const saveImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.json({ message: "File uploaded successfully", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const removeImage = (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res
      .status(400)
      .json({ success: false, message: "No file path provided" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete file" });
    }
    res.json({ success: true, message: "File deleted successfully" });
  });
};

