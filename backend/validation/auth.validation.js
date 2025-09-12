import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";

export const authValidation = {
  signup: {
    body: joi.object({
      fullName: generalFields.fullName.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
      phone: generalFields.phone.required(),
      age: generalFields.age,
      lang: generalFields.lang,
      role: joi.string()
        .valid(roleEnum.user, roleEnum.organizer)
        .default(roleEnum.user),
    }).required(),
  },

  confirmemail: {
    body: joi.object({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
    }).required(),
  },

  resendConfirmemail: {
    body: joi.object({
      email: generalFields.email.required(),
    }).required(),
  },

  login: {
    body: joi.object({
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    }).required(),
  },

  forgotPassword: {
    body: joi.object({
      email: generalFields.email.required(),
    }).required(),
  },

  resendResetPassword: {
    body: joi.object({
      email: generalFields.email.required(),
    }).required(),
  },

  resetPassword: {
    body: joi.object({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
      newPassword: generalFields.password.required(),
    }).required(),
  },

  refreshToken: {
    body: joi.object({
      refreshToken: joi.string().required(),
    }).required(),
  },

  logout: {
    body: joi.object({
      refreshToken: joi.string().required(),
    }).required(),
  }
};
