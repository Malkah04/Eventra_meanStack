import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin ID is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
    name: { type: String, required: true, trim: true },
    location: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    capacity: { type: Number, required: true, min: [1, "Capacity must be at least 1"] },
    pricePerHour: { type: Number, required: true, min: [0, "Price must be positive"] },
    features: { type: [String], default: [] },
    description: { type: String, trim: true, default: "" },
    images: { type: [String], default: [] },
    availability: {
      openTime: { type: String },
      closeTime: { type: String },
      days: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);
export default Venue;
