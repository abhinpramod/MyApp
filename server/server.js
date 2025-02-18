const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB }= require("./lib/db");
dotenv.config();
const userRoutes = require("./routes/user.routes");
const contractorRoutes = require("./routes/contractor.Routes");

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/contractor", contractorRoutes);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("data base connection error", error.message));