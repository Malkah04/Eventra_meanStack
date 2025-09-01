const mongoose = require("mongoose");

function connectDB() {
  try {
    mongoose.connect(process.env.ATLS_URL);
    console.log("connect to mongodb");
  } catch (err) {
    console.log("connection error ", err);
  }
}
module.exports = connectDB;
