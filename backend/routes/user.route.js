import { Router } from "express";
import upload from "../middleware/upload.middleware.js"; // ✅ اسم الملف متطابق
import * as userController from "../controllers/user.controller.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/user.validation.js";
import { roleEnum } from "../DB/models/user.model.js";

const router = Router();

// ================= ADMIN ROUTES =================
router.get(
  "/admin/all",
  authentication(),
  authorization([roleEnum.admin]),
  userController.getAllUsers
);

// ================= CURRENT USER PROFILE =================
router.get("/profile", authentication(), userController.profile);

// ================= UPDATE PROFILE =================
router.patch(
  "/update",
  authentication(),
  upload.single("avatar"),
  validation(validators.updateBasicProfile),
  userController.updateBasicProfile
);

router.patch(
  "/update-password",
  authentication(),
  validation(validators.updatePassword),
  userController.updatePassword
);

// ================= PUBLIC PROFILE =================
router.get(
  "/:userId/profile",
  validation(validators.shareProfile),
  userController.shareProfile
);

// ================= ACCOUNT CONTROL =================
router.delete(
  "/:userId/freeze",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.freezeAccount),
  userController.freezeAccount
);

router.patch(
  "/:userId/restore",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.restoreAccount),
  userController.restoreAccount
);

router.delete(
  "/:userId/delete",
  authentication(),
  authorization([roleEnum.admin]),
  validation(validators.hardDeleteAccount),
  userController.hardDeleteAccount
);

export default router;
