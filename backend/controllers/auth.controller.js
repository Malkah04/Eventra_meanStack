import { providerEnum, UserModel } from "../DB/models/user.model.js";
import * as DBService from "../DB/db.service.js";
import { generateHash, compareHash } from "../utils/security/hash.security.js";
import { sendTestEmail } from "../utils/email/sendTestEmail.js";
import { generateToken, tokenTypeEnum, verifyToken } from "../utils/security/token.security.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { customAlphabet } from "nanoid";
import { generateEncryption } from "../utils/security/encryption.security.js";
import { OAuth2Client } from "google-auth-library";
import { verifyGoogleToken } from '../utils/security/google.security.js';


// =================== Signup ====================
export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone, role } = req.body;

  if (await DBService.findOne({ model: UserModel, filter: { email } })) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  const parts = (fullName || "").trim().split(/\s+/);
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ") || firstName;

  const hashPassword = await generateHash({ plaintext: password });
  const encPhone = phone ? await generateEncryption({ plaintext: phone }) : undefined;

  // OTP
  const otp = customAlphabet("0123456789", 4)();
  const hashOTP = await generateHash({ plaintext: otp });

  const [user] = await DBService.create({
    model: UserModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        phone: encPhone,
        role: role || undefined,
        confirmEmailOTP: hashOTP,
        confirmEmailOTPExpiresAt: new Date(Date.now() + 2 * 60 * 1000), // ✅ Date object
      },
    ],
  });

  await sendTestEmail({
    to: email,
    subject: "Your Confirmation OTP",
    html: `<h1>Your OTP is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, status: 201, data: { user } });
});


// =================== Confirm Email ====================
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return next(new Error("Invalid account or OTP expired", { cause: 404 }));

  // تحقق من وجود الـ OTP وصلاحيته
  if (!user.confirmEmailOTP || Date.now() > user.confirmEmailOTPExpiresAt.getTime()) {
    return next(new Error("OTP expired", { cause: 400 }));
  }

  // تحقق من الكود
  const match = await compareHash({ plaintext: otp, hashValue: user.confirmEmailOTP });
  if (!match) return next(new Error("Invalid OTP", { cause: 400 }));

  // تحديث بيانات المستخدم
  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: { confirmEmailAt: new Date() }, // هنا خليتها Date object
      $unset: { confirmEmailOTP: 1, confirmEmailOTPExpiresAt: 1 },
    },
    { new: true }
  );

  return successResponse({ res, message: "Email confirmed successfully", data: { user: updatedUser } });
});


// =================== Resend Confirm Email OTP ====================
export const resendConfirmEmailOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    email,
    provider: providerEnum.system,
    confirmEmailAt: { $exists: false },
  });
  if (!user) return next(new Error("Invalid account or already confirmed", { cause: 404 }));

  const otp = customAlphabet("0123456789", 4)();

  user.confirmEmailOTP = await generateHash({ plaintext: otp });
  user.confirmEmailOTPExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // صلاحية دقيقتين
  user.confirmEmailOTPRetries = (user.confirmEmailOTPRetries || 0) + 1;

  await user.save();

  await sendTestEmail({
    to: email,
    subject: "New Confirmation OTP",
    html: `<h1>Your new OTP is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, message: "OTP resent successfully" });
});

// =================== Login ====================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await DBService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.system },
  });

  if (!user) return next(new Error("Invalid email or password", { cause: 400 }));

  if (!user.confirmEmailAt) {
    return next(new Error("Email not confirmed. Please confirm your email first.", { cause: 403 }));
  }

  const isMatch = await compareHash({ plaintext: password, hashValue: user.password });
  if (!isMatch) return next(new Error("Invalid email or password", { cause: 400 }));

  // Access token
  const accessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.ACCESS_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" },
  });

  // Refresh token
  const refreshToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" },
  });

  // إدارة refresh tokens: الاحتفاظ بآخر 5 فقط
  const userDoc = await UserModel.findById(user._id);
  userDoc.refreshTokens.push({ token: refreshToken });
  if (userDoc.refreshTokens.length > 5) userDoc.refreshTokens.shift(); // حذف الأقدم
  await userDoc.save();

  return successResponse({
    res,
    message: "Login successful",
    data: { user, accessToken, refreshToken },
  });
});


// =================== Google Login ====================
export const googleLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const payload = await verifyGoogleToken(token);

  const { email, name, sub } = payload;

  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      fullName: name,
      email,
      provider: providerEnum.google,
      googleId: sub,
    });
  }

  const accessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.ACCESS_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN || '15m' },
  });

  const refreshToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' },
  });

  // إدارة refresh tokens: الاحتفاظ بآخر 5 فقط
  const userDoc = await UserModel.findById(user._id);
  userDoc.refreshTokens.push({ token: refreshToken });
  if (userDoc.refreshTokens.length > 5) userDoc.refreshTokens.shift();
  await userDoc.save();

  return successResponse({
    res,
    message: 'Google login successful',
    data: { user, accessToken, refreshToken },
  });
});

//================= Forgot Password ===============
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email, provider: providerEnum.system });
  if (!user) return next(new Error("Invalid email", { cause: 404 }));

  const otp = customAlphabet("0123456789", 4)();
  const hashOTP = await generateHash({ plaintext: otp });

  user.resetPasswordOTP = hashOTP;
  user.resetPasswordOTPExpiresAt = Date.now() + 2 * 60 * 1000;
  await user.save();

  await sendTestEmail({
    to: email,
    subject: "Reset Password Code",
    html: `<h1>Your reset code is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, message: "Reset code sent to email", data: { user } });
});

//================= Resend Reset Password OTP ===============
export const resendResetPasswordOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email, provider: providerEnum.system });
  if (!user) return next(new Error("Invalid account", { cause: 404 }));

  const otp = customAlphabet("0123456789", 4)();
  user.resetPasswordOTP = await generateHash({ plaintext: otp });
  user.resetPasswordOTPExpiresAt = Date.now() + 2 * 60 * 1000;
  user.resetPasswordOTPRetries = (user.resetPasswordOTPRetries || 0) + 1;

  await user.save();

  await sendTestEmail({
    to: email,
    subject: "New Reset Password OTP",
    html: `<h1>Your new OTP is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, message: "Reset OTP resent successfully", data: { user } });
});

//================= Reset Password ===============
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await UserModel.findOne({ email, provider: providerEnum.system });
  if (!user) return next(new Error("Invalid email", { cause: 404 }));

  if (!user.resetPasswordOTP || Date.now() > user.resetPasswordOTPExpiresAt) {
    return next(new Error("Reset code expired", { cause: 400 }));
  }

  const match = await compareHash({ plaintext: otp, hashValue: user.resetPasswordOTP });
  if (!match) return next(new Error("Invalid reset code", { cause: 400 }));

  const hashNewPassword = await generateHash({ plaintext: newPassword });

  user.password = hashNewPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpiresAt = undefined;
  await user.save();

  return successResponse({ res, message: "Password reset successfully", data: { user } });
});

//------------------------------------------------
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new Error("Refresh token required", { cause: 401 }));

  const decoded = verifyToken({
    token: refreshToken,
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE,
  });

  const user = await UserModel.findOne({
    _id: decoded._id,
    "refreshTokens.token": refreshToken,
  });
  if (!user) return next(new Error("Invalid refresh token", { cause: 401 }));

  const newAccessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.ACCESS_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" },
  });

  return successResponse({ res, data: { accessToken: newAccessToken } });
});

//------------------------------------------------
export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new Error("Refresh token required", { cause: 401 }));

  const decoded = verifyToken({
    token: refreshToken,
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE,
  });

  await UserModel.updateOne(
    { _id: decoded._id },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );

  return successResponse({ res, message: "Logged out successfully" });
});
