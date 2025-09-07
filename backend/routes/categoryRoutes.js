import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/category.validation.js";
import { roleEnum } from "../DB/models/user.model.js"; // لو عندك رولز زي Admin

const router = Router();

// إنشاء كاتيجوري جديدة (Admin فقط مثلاً)
router.post(
  "/",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.createCategory),
  categoryController.createCategory
);

// الحصول على كل الكاتيجوريز (عام)
router.get(
  "/",
  validation(validators.getCategories),
  categoryController.getCategories
);

// الحصول على كاتيجوري واحدة بالـ id
router.get(
  "/:categoryId",
  validation(validators.getCategoryById),
  categoryController.getCategoryById
);

// تحديث كاتيجوري (Admin فقط مثلاً)
router.patch(
  "/:categoryId",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.updateCategory),
  categoryController.updateCategory
);

// حذف كاتيجوري (Admin فقط مثلاً)
router.delete(
  "/:categoryId",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.deleteCategory),
  categoryController.deleteCategory
);

export default router;