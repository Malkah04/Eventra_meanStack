import { generateHash, compareHash } from "../utils/security/hash.security.js";
import * as DBService from "../DB/db.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { UserModel, roleEnum } from "../DB/models/user.model.js";
import { generateEncryption, decryptEncryption } from "../utils/security/encryption.security.js";
import { uploadAvatar } from "../middleware/uploadAvatar.middleware.js";

// ================= Profile الحالي مع فك التشفير =================
export const profile = asyncHandler(async (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.password;

  // فك تشفير الهاتف لو موجود
  if (safeUser.phone) {
    safeUser.phone = await decryptEncryption({ cipherText: safeUser.phone });
  }

  return successResponse({ res, data: { user: safeUser } });
});

// ================= Share Profile مع فك التشفير =================
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { _id: userId },
    select: "-password -role",
  });

  if (user && user.phone) {
    user.phone = await decryptEncryption({ cipherText: user.phone });
  }

  return user ? successResponse({ res, data: { user } }) : next(new Error("Not registered account", { cause: 404 }));
});

// ================= Update Profile مع صورة =================
export const updateBasicProfile = asyncHandler(async (req, res, next) => {
  const payload = { ...req.body };

  if (payload.phone) payload.phone = await generateEncryption({ plaintext: payload.phone });
  if (req.file) payload.avatar = `/uploads/avatars/${req.file.filename}`;

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { $set: payload, $inc: { __v: 1 } },
    select: "-password",
  });

  if (user && user.phone) {
    user.phone = await decryptEncryption({ cipherText: user.phone });
  }

  return user ? successResponse({ res, data: { user } }) : next(new Error("Not registered account", { cause: 404 }));
});

// ================= Freeze / Restore / Hard Delete / Update Password =================
export const freezeAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin) return next(new Error("Regular user cannot freeze other user account", { cause: 403 }));
  const targetId = userId || req.user._id;
  const result = await DBService.updateOne({
    model: UserModel,
    filter: { _id: targetId, freezedAt: { $exists: false } },
    data: { $set: { freezedAt: Date.now(), freezedBy: req.user._id }, $inc: { __v: 1 } },
  });
  return result.matchedCount
    ? successResponse({ res, data: { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount } })
    : next(new Error("Not registered account", { cause: 404 }));
});

export const restoreAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin) return next(new Error("Regular user cannot restore other user account", { cause: 403 }));
  const targetId = userId || req.user._id;
  const result = await DBService.updateOne({
    model: UserModel,
    filter: { _id: targetId, freezedAt: { $exists: true } },
    data: { $set: { restoredBy: req.user._id }, $unset: { freezedAt: 1, freezedBy: 1 }, $inc: { __v: 1 } },
  });
  return result.matchedCount
    ? successResponse({ res, data: { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount } })
    : next(new Error("Not registered account", { cause: 404 }));
});

export const hardDeleteAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const targetId = userId || req.user._id;
  if (req.user.role !== roleEnum.admin && targetId.toString() !== req.user._id.toString())
    return next(new Error("Regular user cannot hard-delete other user account", { cause: 403 }));
  const result = await DBService.deleteOne({ model: UserModel, filter: { _id: targetId } });
  return result.deletedCount
    ? successResponse({ res, data: { deletedCount: result.deletedCount } })
    : next(new Error("Not registered account", { cause: 404 }));
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await DBService.findById({ model: UserModel, id: req.user._id });
  const match = await compareHash({ plaintext: oldPassword, hashValue: user.password });
  if (!match) return next(new Error("Old password is incorrect", { cause: 400 }));
  const newHashedPassword = await generateHash({ plaintext: newPassword });
  await DBService.updateOne({ model: UserModel, filter: { _id: req.user._id }, data: { $set: { password: newHashedPassword }, $inc: { __v: 1 } } });
  return successResponse({ res, message: "Password updated successfully", data: { userId: user._id, email: user.email } });
});
