  import mongoose from "mongoose";
  import bcrypt from "bcryptjs";

  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
      },
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
        country: { type: String, default: "" },
      },
      role: {
        type: String,
        default: "user",
      },
      cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
      orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    },
    { timestamps: true }
  );

  // Hash password before saving
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });


  const User = mongoose.model("User", userSchema);

  export default User;
