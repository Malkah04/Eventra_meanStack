import mongoose from "mongoose";

const orgCartSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        venueId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Venue",
        },
        start: {
          type: String,
          // required: true,
        },
        end: {
          type: String,
          // required: true,
        },
        totalPrice: {
          type: Number,
        },
        status: {
          type: String,
          enum: ["pending", "booked"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("orgCart", orgCartSchema);
