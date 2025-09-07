import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { categoryValidation } from "../validation/category.validation.js";

const router = express.Router();

//Create Category (Admin فقط)
router.post(
  "/",
  authentication(),
  authorization([roleEnum.admin]),
  validation(categoryValidation.create),
  createCategory
);

// Get all categories (عام)
router.get("/", getCategories);

// Get single category (عام)
router.get("/:id", validation(categoryValidation.getById), getCategoryById);

// Update category (Admin فقط)
router.patch(
  "/:id",
  authentication(),
  authorization([roleEnum.admin]),
  validation(categoryValidation.update),
  updateCategory
);

//Delete category (Admin فقط)
router.delete(
  "/:id",
  authentication(),
  authorization([roleEnum.admin]),
  validation(categoryValidation.delete),
  deleteCategory
);

export default router;
