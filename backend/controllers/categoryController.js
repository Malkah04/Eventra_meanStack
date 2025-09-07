import * as DBService from "../DB/db.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { CategoryModel } from "../DB/models/category.js";

// ================= Create Category =================
export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await DBService.create({
    model: CategoryModel,
    data: req.body,
  });
  return successResponse({ res, data: { category }, status: 201 });
});

// ================= Get All Categories =================
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await DBService.find({
    model: CategoryModel,
  });
  return successResponse({ res, data: { categories } });
});

// ================= Get Category By ID =================
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await DBService.findById({
    model: CategoryModel,
    id: req.params.id,
  });

  return category
    ? successResponse({ res, data: { category } })
    : next(new Error("Category not found", { cause: 404 }));
});

// ================= Update Category =================
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await DBService.findOneAndUpdate({
    model: CategoryModel,
    filter: { _id: req.params.id },
    data: { $set: req.body, $inc: { __v: 1 } },
  });

  return category
    ? successResponse({ res, data: { category } })
    : next(new Error("Category not found", { cause: 404 }));
});

// ================= Delete Category =================
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const result = await DBService.deleteOne({
    model: CategoryModel,
    filter: { _id: req.params.id },
  });

  return result.deletedCount
    ? successResponse({ res, data: { deletedCount: result.deletedCount } })
    : next(new Error("Category not found", { cause: 404 }));
});
