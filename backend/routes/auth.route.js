import express from "express";
import {
  signup,
  confirmEmail,
  login,
  resendConfirmEmailOTP,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
  googleLogin // تأكد من استيراد الدالة الجديدة
} from "../controllers/auth.controller.js";
import { authValidation } from "../validation/auth.validation.js";
import { validation } from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup", validation(authValidation.signup), signup);
router.post("/login", validation(authValidation.login), login);
router.post("/google", googleLogin); // إضافة طريق Google Login
router.patch("/confirm-email", validation(authValidation.confirmemail), confirmEmail);
router.post("/resend-confirm-email", validation(authValidation.resendConfirmemail), resendConfirmEmailOTP);
router.post("/forgot-password", validation(authValidation.forgotPassword), forgotPassword);
router.post("/reset-password", validation(authValidation.resetPassword), resetPassword);
router.post("/refresh-token", validation(authValidation.refreshToken), refreshAccessToken);
router.post("/logout", validation(authValidation.logout), logout);

export default router;