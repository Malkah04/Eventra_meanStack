import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.connect.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import { globalErrorHandling } from "./utils/response.js";
import categoryPath from "./routes/categoryRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import venueBookingRouter from "./routes/venue.booking.routes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

await connectDB();


app.use("/api/category", categoryPath);
app.use('/api/venues', venueRouter);
app.use('/api/venuebooking', venueBookingRouter);
app.use('/api/events', eventRoutes);
//----------------------------------------------------
app.get("/", (req, res) => res.json({ message: "welcome to app" }));

app.use("/auth", authRouter);
app.use("/user", userRouter);

// 404 fallback
// app.all("*", (req, res) => res.status(404).json({ message: "in-valid app" }));
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Global error handler
app.use(globalErrorHandling);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
