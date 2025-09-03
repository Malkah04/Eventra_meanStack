const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const categoryPath = require("./routes/categoryRoutes");
require("dotenv").config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());
app.use("/api/category", categoryPath);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server running on port 5000");
});
