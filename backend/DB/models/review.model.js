import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "postType",
    },
    postType: {
      type: String,
      required: true,
      enum: ["Event", "Venue"],
    },
    comment: {
      type: String,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Review", reviewSchema);
