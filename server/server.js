const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB }= require("./lib/db");
dotenv.config();
const userRoutes = require("./routes/user.routes");
const contractorRoutes = require("./routes/contractor.Routes");
const cookieParser = require("cookie-parser");
const storeRoutes = require("./routes/store.Routes");
const productRoutes = require("./routes/product.Routes");
const cartRoutes = require("./routes/cart.Routes");
const orderRoutes = require("./routes/order.Routes");
const paymentRoutes = require("./routes/payment.routes");
const reviewRoutes = require("./routes/review.Routes");
// const webhookRoute = require("./routes/webhook.routes"); 
const testimonialsRoutes = require("./routes/testimonials.routes");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser())
app.use("/api/user", userRoutes);
app.use("/api/contractor", contractorRoutes);
app.use("/api/store", storeRoutes);
app.use ("/api/products",productRoutes )
app.use ("/api/cart",cartRoutes) 
app.use("/api/testimonials", testimonialsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// app.use('/api/webhook', webhookRoute);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("data base connection error", error.message));