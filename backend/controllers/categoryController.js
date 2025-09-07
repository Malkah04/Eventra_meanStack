import { asyncHandler, successResponse } from "../utils/response.js";
import Category from "../DB/models/category.js";

// =================== Create ====================
export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  return successResponse({ res, status: 201, data: { category } });
});

// =================== Get All ====================
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return successResponse({ res, data: { categories } });
});

// =================== Get By Id ====================
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  return successResponse({ res, data: { category } });
});

// =================== Update ====================
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  return successResponse({ res, data: { category } });
});

// =================== Delete ====================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new Error("Category not found", { cause: 404 }));
  return successResponse({ res, message: "Category deleted successfully" });
});
