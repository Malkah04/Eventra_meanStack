const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server running on port 5000");
});
