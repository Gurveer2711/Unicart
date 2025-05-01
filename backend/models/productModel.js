import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: {
    rate: { type: Number, default: 1, min: 1, max: 5 },
    count: { type: Number, default: 0 },
  },
  stocksLeft: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

productSchema.statics.getNewProducts = function () {
  return this.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        title: 1,
        originalPrice: 1,
        discountedPrice: 1,
        image: 1,
        rating: 1,
        stocksLeft: 1,
        description: 1,
        category: 1,
        createdAt: 1,
      },
    },
  ]);
};

productSchema.statics.getTopSellingProducts = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "orders",
        let: { productId: "$_id" },
        pipeline: [
          { $unwind: "$orderItems" },
          {
            $match: {
              $expr: { $eq: ["$orderItems.product", "$$productId"] },
            },
          },
          {
            $group: {
              _id: null,
              totalSold: { $sum: "$orderItems.quantity" },
            },
          },
        ],
        as: "sales",
      },
    },
    { $unwind: { path: "$sales", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        title: 1,
        originalPrice: 1,
        discountedPrice: 1,
        image: 1,
        rating: 1,
        stocksLeft:1,
        totalSold: { $ifNull: ["$sales.totalSold", 0] },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ]);
};

const Product = mongoose.model("Product", productSchema);
export default Product;
