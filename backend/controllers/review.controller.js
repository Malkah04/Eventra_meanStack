import { asyncHandler } from "../utils/response.js";
import Venue from "../DB/models/venue.js";
import Event from "../DB/models/event.js";
import Review from "../DB/models/review.model.js";
import UserModel from "../DB/models/user.model.js";

export const addComment = asyncHandler(async (req, res) => {
  const { postType, postId, userId, comment, rate } = req.body;
  const isUser = await UserModel.findById(userId);
  if (!isUser) {
    return res.status(404).json({ message: "user not found" });
  }
  if (postType === "Event") {
    const isEvent = await Event.findById(postId);
    if (!isEvent) return res.status(404).json({ message: "event not exist" });
  }
  if (postType === "Venue") {
    const isVenue = await Venue.findById(postId);
    if (!isVenue) return res.status(404).json({ message: "venue not exist" });
  }
  const review = new Review({
    postId,
    postType,
    userId,
    comment: comment || null,
    rate: rate || null,
  });
  const save = await review.save();
  res.status(201).json({ message: "comment added", save });
});

export const getCommentsOfPostId = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const comment = await Review.find({ postId });
  if (!comment) {
    return res.status(400).json({ message: "no comment" });
  }
  res.status(200).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "no comment" });
  }

  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({ message: "comment deleted" });
});

export const updateComment = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: "no comment" });
  }
  review.comment = comment;
  const updatedReview = await review.save();
  res.status(200).json({
    message: "Comment updated successfully",
    review: updatedReview,
  });
});
