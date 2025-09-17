import mongoose from "mongoose";

const orgCartItemSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, "Price must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "booked", "cancelled"],
      default: "pending",
    },
  },
  { _id: false }
);

const orgCartSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orgCartItemSchema],
  },
  { timestamps: true }
);

// Virtual: عدد العناصر
orgCartSchema.virtual("itemCount").get(function () {
  return this.items.length;
});

// Middleware: احسب totalPrice لو عايز (اختياري)
orgCartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    if (item.start && item.end) {
      const duration =
        (new Date(item.end).getTime() - new Date(item.start).getTime()) /
        (1000 * 60 * 60); // الساعات
      if (duration > 0 && !item.totalPrice) {
        // هنا ممكن تضرب في سعر الساعة للـ Venue بعد ما تجيبه
        item.totalPrice = duration * 100; // قيمة افتراضية مثلا
      }
    }
  });
  next();
});

export const OrgCartModel =
  mongoose.models.OrgCart || mongoose.model("OrgCart", orgCartSchema);

export default OrgCartModel;
