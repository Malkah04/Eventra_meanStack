import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.connect.js";

// Routers
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/categoryRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import bookingRouter from "./routes/venue.booking.routes.js";
import eventRouter from "./routes/eventRoutes.js";
import orgCartRouter from "./routes/orgCart.router.js";
import cartRouter from "./routes/cartRoutes.js";
import paymentRouter from "./routes/payment.route.js";

// Utils
import { globalErrorHandling } from "./utils/response.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Connect to Database
await connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/venues", venueRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/events", eventRouter);
app.use("/api/orgCart", orgCartRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);

// Root Route
app.get("/", (req, res) => res.json({ message: "Welcome to the app" }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handler
app.use(globalErrorHandling);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
