import { generateHash, compareHash } from "../utils/security/hash.security.js";
import * as DBService from "../DB/db.service.js";
import { asyncHandler } from "../utils/response.js";
import { UserModel, roleEnum } from "../DB/models/user.model.js";
import { generateEncryption, decryptEncryption } from "../utils/security/encryption.security.js";
import fs from "fs";

/**
 * Helper: mask phone for public profiles
 */
function maskPhone(clearPhone) {
  if (!clearPhone) return null;
  const str = String(clearPhone);
  if (str.length <= 3) return "•••";
  const visible = str.slice(0, 3);
  const masked = "•".repeat(Math.max(0, str.length - 3));
  return visible + masked;
}

// ================= Profile (current user) =================
export const profile = asyncHandler(async (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.password;

  if (safeUser.phone) {
    try {
      safeUser.phone = await decryptEncryption({ cipherText: safeUser.phone });
    } catch (err) {
      console.error("Phone decryption error:", err);
      safeUser.phone = null;
    }
  }

  return res.status(200).json(safeUser);
});

// ================= Public Profile =================
export const shareProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await DBService.findOne({
    model: UserModel,
    filter: { _id: userId },
    select: "-password", // ممكن تخليها "-password -role" لو مش عايزة الـ role
  });

  if (!user) return res.status(404).json({ message: "Not registered account" });

  const userObj = user.toObject();

  if (userObj.phone) {
    try {
      const decryptedPhone = await decryptEncryption({ cipherText: userObj.phone });
      userObj.phone = maskPhone(decryptedPhone);
    } catch (err) {
      console.error("Phone decryption error (public):", err);
      userObj.phone = null;
    }
  }

  return res.status(200).json({ success: true, user: userObj });
});

// ================= Update Profile =================
export const updateBasicProfile = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  // 🔒 Encrypt phone
  if (payload.phone) {
    payload.phone = await generateEncryption({ plaintext: payload.phone });
  }

  // 🖼️ Avatar upload (local)
  if (req.file) {
    payload.avatar = `/uploads/avatars/${req.file.filename}`;
  }

  const user = await DBService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { $set: payload, $inc: { __v: 1 } },
    select: "-password",
  });

  if (!user) return res.status(404).json({ message: "Not registered account" });

  if (user.phone) {
    try {
      user.phone = await decryptEncryption({ cipherText: user.phone });
    } catch {
      user.phone = null;
    }
  }

  return res.status(200).json(user);
});
// ================= Freeze Account =================
export const freezeAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin)
    return res.status(403).json({ message: "Regular user cannot freeze other user account" });

  const targetId = userId || req.user._id;
  const result = await DBService.updateOne({
    model: UserModel,
    filter: { _id: targetId, freezedAt: { $exists: false } },
    data: { $set: { freezedAt: Date.now(), freezedBy: req.user._id }, $inc: { __v: 1 } },
  });

  if (!result.matchedCount) return res.status(404).json({ message: "Not registered account" });
  return res.status(200).json(result);
});

// ================= Restore Account =================
export const restoreAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.admin)
    return res.status(403).json({ message: "Regular user cannot restore other user account" });

  const targetId = userId || req.user._id;
  const result = await DBService.updateOne({
    model: UserModel,
    filter: { _id: targetId, freezedAt: { $exists: true } },
    data: { $set: { restoredBy: req.user._id }, $unset: { freezedAt: 1, freezedBy: 1 }, $inc: { __v: 1 } },
  });

  if (!result.matchedCount) return res.status(404).json({ message: "Not registered account" });
  return res.status(200).json(result);
});

// ================= Hard Delete Account =================
export const hardDeleteAccount = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const targetId = userId || req.user._id;

  if (req.user.role !== roleEnum.admin && targetId.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Regular user cannot hard-delete other user account" });

  const result = await DBService.deleteOne({ model: UserModel, filter: { _id: targetId } });
  if (!result.deletedCount) return res.status(404).json({ message: "Not registered account" });

  return res.status(200).json(result);
});

// ================= Update Password =================
export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await DBService.findById({ model: UserModel, id: req.user._id });

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await compareHash({ plaintext: oldPassword, hashValue: user.password });
  if (!match) return res.status(400).json({ message: "Old password is incorrect" });

  const newHashedPassword = await generateHash({ plaintext: newPassword });

  await DBService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { $set: { password: newHashedPassword }, $inc: { __v: 1 } },
  });

  return res.status(200).json({ message: "Password updated successfully" });
});

// ================= Get All Users (Admin) =================
export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await UserModel.find({}, "-password");
    const safeUsers = await Promise.all(
      users.map(async (u) => {
        const userObj = u.toObject();
        if (userObj.phone) {
          try {
            userObj.phone = await decryptEncryption({ cipherText: userObj.phone });
          } catch {
            userObj.phone = null;
          }
        }
        return userObj;
      })
    );

    // ✅ رجع مصفوفة مباشرة
    return res.status(200).json(safeUsers);
  } catch (err) {
    return next(err);
  }
});
