import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
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

productSchema.statics.getNewProductsByCategory = function () {
  return this.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        title: 1,
        price: 1,
        image: 1,
        rating: 1,
        stocksLeft: 1,
        description: 1,
        category: 1,
      },
    },
  ]);
};

productSchema.statics.getTopSellingProducts = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "orders", // Lookup the orders collection
        let: { productId: "$_id" }, // Reference the product ID
        pipeline: [
          { $unwind: "$orderItems" }, // Flatten the orderItems array
          {
            $match: {
              $expr: { $eq: ["$orderItems.product", "$$productId"] }, // Match product in order items
            },
          },
          {
            $group: {
              _id: null,
              totalSold: { $sum: "$orderItems.quantity" }, // Sum up quantities sold
            },
          },
        ],
        as: "sales", // Alias for sales data
      },
    },
    { $unwind: { path: "$sales", preserveNullAndEmptyArrays: true } }, // Unwind sales data
    {
      $project: {
        _id: 1,
        title: 1,
        price: 1,
        image: 1,
        totalSold: { $ifNull: ["$sales.totalSold", 0] }, // Default to 0 if no sales data
      },
    },
    { $sort: { totalSold: -1 } }, // Sort by totalSold in descending order
    { $limit: 10 }, // Limit to top 10 products
  ]);
};


const Product = mongoose.model("Product", productSchema);
export default Product;
