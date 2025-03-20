import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: {
    rate: { type: Number, default: 1,min:1,max:5 },
    count: { type: Number, default: 0 },
  },
  stocksLeft: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
