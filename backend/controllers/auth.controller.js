import { providerEnum, UserModel } from "../DB/models/user.model.js";
import * as DBService from "../DB/db.service.js";
import { generateHash, compareHash } from "../utils/security/hash.security.js";
import { sendTestEmail } from "../utils/email/sendTestEmail.js";
import { generateToken, tokenTypeEnum, verifyToken } from "../utils/security/token.security.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { customAlphabet } from "nanoid";
import { generateEncryption } from "../utils/security/encryption.security.js";

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
        role: role || undefined, // 👈 هنا لو مبعتش حاجة هيفضل default User من الـ schema
        confirmEmailOTP: hashOTP,
        confirmEmailOTPExpiresAt: Date.now() + 2 * 60 * 1000,
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

  if (!user.confirmEmailOTP || Date.now() > user.confirmEmailOTPExpiresAt) {
    return next(new Error("OTP expired", { cause: 400 }));
  }

  const match = await compareHash({ plaintext: otp, hashValue: user.confirmEmailOTP });
  if (!match) return next(new Error("Invalid OTP", { cause: 400 }));

  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: { confirmEmailAt: Date.now() },
      $unset: { confirmEmailOTP: 1, confirmEmailOTPExpiresAt: 1 },
    },
    { new: true }
  );

  return successResponse({ res, message: "Email confirmed successfully", data: { user: updatedUser } });
});

// =================== Resend Confirm Email OTP ====================
export const resendConfirmEmailOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email, provider: providerEnum.system, confirmEmailAt: { $exists: false } });
  if (!user) return next(new Error("Invalid account or already confirmed", { cause: 404 }));

  const otp = customAlphabet("0123456789", 4)();
  user.confirmEmailOTP = await generateHash({ plaintext: otp });
  user.confirmEmailOTPExpiresAt = Date.now() + 2 * 60 * 1000;
  user.confirmEmailOTPRetries = (user.confirmEmailOTPRetries || 0) + 1;

  await user.save();

  await sendTestEmail({
    to: email,
    subject: "New Confirmation OTP",
    html: `<h1>Your new OTP is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, message: "OTP resent successfully", data: { user } });
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

  // access token
  const accessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.ACCESS_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" },
  });

  // refresh token
  const refreshToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" },
  });

  // خزّنه فى الداتابيز علشان الـ logout يقدر يمسحه
  await UserModel.findByIdAndUpdate(user._id, {
    $push: { refreshTokens: { token: refreshToken } },
  });

  return successResponse({
    res,
    message: "Login successful",
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

//=================forgotpassword===============
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email, provider: providerEnum.system });
  if (!user) return next(new Error("Invalid email", { cause: 404 }));

  const otp = customAlphabet("0123456789", 4)();
  const hashOTP = await generateHash({ plaintext: otp });

  user.forgotCode = hashOTP;
  user.confirmEmailOTPExpiresAt = Date.now() + 2 * 60 * 1000;
  await user.save();


  await sendTestEmail({
    to: email,
    subject: "Reset Password Code",
    html: `<h1>Your reset code is: ${otp}</h1><p>It will expire in 2 minutes.</p>`,
  });

  return successResponse({ res, message: "Reset code sent to email", data: { user } });
});
//======================Reset Password========================
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;


  const user = await UserModel.findOne({ email, provider: providerEnum.system });
  if (!user) return next(new Error("Invalid email", { cause: 404 }));

  if (!user.forgotCode || Date.now() > user.confirmEmailOTPExpiresAt) {
    return next(new Error("Reset code expired", { cause: 400 }));
  }

  const match = await compareHash({ plaintext: otp, hashValue: user.forgotCode });
  if (!match) return next(new Error("Invalid reset code", { cause: 400 }));


  const hashNewPassword = await generateHash({ plaintext: newPassword });


  user.password = hashNewPassword;
  user.forgotCode = undefined;
  user.confirmEmailOTPExpiresAt = undefined;
  await user.save();

  return successResponse({ res, message: "Password reset successfully", data: { user } });
});
//------------------------------------------------
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new Error("Refresh token required", { cause: 401 }));

  const decoded = verifyToken({
    token: refreshToken,
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
  });

  const user = await UserModel.findOne({
    _id: decoded._id,
    "refreshTokens.token": refreshToken
  });
  if (!user) return next(new Error("Invalid refresh token", { cause: 401 }));

  const newAccessToken = generateToken({
    payload: { _id: user._id, role: user.role },
    signature: process.env.ACCESS_TOKEN_USER_SIGNATURE,
    options: { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" },
  });

  return successResponse({ res, data: { accessToken: newAccessToken } });
});
//----------------------------------------------------
export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(new Error("Refresh token required", { cause: 401 }));

  const decoded = verifyToken({
    token: refreshToken,
    signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
  });

  await UserModel.updateOne(
    { _id: decoded._id },
    { $pull: { refreshTokens: { token: refreshToken } } }
  );

  return successResponse({ res, message: "Logged out successfully" });
});
