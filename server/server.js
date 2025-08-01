const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./lib/db");

const userRoutes = require("./routes/user.routes");
const contractorRoutes = require("./routes/contractor.Routes");
const storeRoutes = require("./routes/store.Routes");
const productRoutes = require("./routes/product.Routes");
const cartRoutes = require("./routes/cart.Routes");
const orderRoutes = require("./routes/order.Routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.Routes");
const authRoutes = require("./routes/auth.Routes");
const testimonialsRoutes = require("./routes/testimonials.routes");

app.use(cors({
  origin: process.env.CLIENT_URL||process.env.CLIENT_URL2, 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contractor", contractorRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ DB + Server Start
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error.message));
