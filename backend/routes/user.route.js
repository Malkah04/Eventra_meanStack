import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authentication ,authorization } from "../middleware/authentication.middleware.js";
import { validation } from "../middleware/validation.middleware.js";
import * as validators from "../validation/user.validation.js";
import { roleEnum } from "../DB/models/user.model.js";


const router = Router();

// Profile for current user
router.get("/", authentication(), userController.profile);

// Public share profile
router.get("/:userId/profile", validation(validators.shareProfile), userController.shareProfile);

// Update basic profile
router.patch("/:userId/update", authentication(), validation(validators.updateBasicProfile), userController.updateBasicProfile);

// يفرّيز حساب حد تانى (Admin فقط)
router.delete(
  "/:userId/freeze",
  authentication(),
  authorization([roleEnum.admin]), // هنا التفويض
  validation(validators.freezeAccount),
  userController.freezeAccount
);

// يعمل restore لحساب حد تانى (Admin فقط)
router.patch(
  "/:userId/restore",
  authentication(),
  authorization([roleEnum.admin]), // Admin بس
  validation(validators.restoreAccount),
  userController.restoreAccount
);

// Hard delete حساب حد تانى (Admin فقط)
router.delete(
  "/:userId/delete",
  authentication(),
  authorization([roleEnum.admin]), // Admin بس
  validation(validators.freezeAccount),
  userController.hardDeleteAccount
);
router.patch(
  "/update-password",
  authentication(),
  validation(validators.updatePassword),
  userController.updatePassword
);
export default router;
