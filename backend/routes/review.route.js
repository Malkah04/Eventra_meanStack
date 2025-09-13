import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsOfPostId,
  updateComment,
} from "../controllers/review.controller.js";
const router = express.Router();

router.get("/:postId", getCommentsOfPostId);

router.delete("/:reviewId", deleteComment);

router.put("/:reviewId", updateComment);

router.post("/", addComment);

export default router;
