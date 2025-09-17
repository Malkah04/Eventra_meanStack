import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    ticketPrice: { type: Number, required: true, min: [0, "Price must be positive"] },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    image: {
      type: [String],
      default: []
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        lat: Number,
        lng: Number
      }
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// منع تكرار نفس الـ event فى نفس المكان والتاريخ
eventSchema.index(
  { name: 1, venueId: 1, date: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export default Event;
