import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // 🔹 Allow sending cookies
  })
);

const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 5, // Limit each IP to 5 requests per 5 seconds
  message: { error: "Too many requests, please try again later." },
  headers: true, // Send `RateLimit-*` headers
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/uploads", express.static("uploads")); // Serve local uploads
app.use("/api/image", imageRoutes);
// Error handling middleware
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
