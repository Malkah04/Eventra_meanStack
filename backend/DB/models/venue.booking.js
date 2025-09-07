import mongoose from "mongoose";

const venueBookingSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer id is required"],
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue id is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is required"],
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    totalPrice: { type: Number, required: true, min: [0, "Total price must be positive"] },
    status: {
      type: String,
      enum: ["pending", "payment", "confirmed", "cancelled"],
      default: "pending",
    },
    details: { type: String, trim: true, default: "" },
    bannerImage: { type: String, default: "" },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const VenueBooking =
  mongoose.models.VenueBooking || mongoose.model("VenueBooking", venueBookingSchema);
export default VenueBooking;
