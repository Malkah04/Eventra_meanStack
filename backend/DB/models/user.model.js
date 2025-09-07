import mongoose from "mongoose";

export const genderEnum = { male: "male", female: "female", other: "other" };
export const roleEnum = { user: "User", admin: "Admin", organizer: "Organizer" };
export const providerEnum = { system: "system", google: "google" };

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: [20, "First name must be less than 20 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: [20, "Last name must be less than 20 characters"],
      trim: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      required: function () {
        return this.provider === providerEnum.system;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: `Gender must be one of: ${Object.values(genderEnum).join(", ")}`,
      },
      default: genderEnum.male,
    },
    provider: { type: String, enum: Object.values(providerEnum), default: providerEnum.system },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: `role only allow: ${Object.values(roleEnum).join(", ")}`,
      },
      default: roleEnum.user,
    },
    phone: String,

    // -------------- تأكيد الإيميل --------------
    confirmEmailAt: Date, // بدل confirmEmail
    confirmEmailOTP: String,
    confirmEmailOTPExpiresAt: Date,
    confirmEmailOTPRetries: { type: Number, default: 0 },
    confirmEmailOTPBlockedUntil: Date,

    // -------------- تجميد واسترجاع --------------
    forgotCode: String,
    freezedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    freezedAt: Date,
        // -------------- reset password --------------
    resetPasswordOTP: String,            // الكود نفسه (hashed)
    resetPasswordOTPExpiresAt: Date,     // صلاحية الكود
    resetPasswordOTPRetries: { type: Number, default: 0 }, // اختيارى
  //--------------refresh tokens---------------------
    refreshTokens: [{
  token: String,
  createdAt: { type: Date, default: Date.now }
}],

  },
  
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);


userSchema
  .virtual("fullName")
  .set(function (value) {
    const parts = (value || "").trim().split(/\s+/);
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ") || firstName;
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
  });

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
UserModel.syncIndexes();
export default UserModel;
