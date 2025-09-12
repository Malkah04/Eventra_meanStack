import Joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";
import { genderEnum } from "../DB/models/user.model.js";

export const shareProfile = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
};

export const updateBasicProfile = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
  body: Joi.object({
    firstName: Joi.string().min(2).max(20),
    lastName: Joi.string().min(2).max(20),
    phone: Joi.string().min(8).max(15),
    gender: Joi.string().valid(...Object.values(genderEnum)),
  }).min(1).required(),
};

export const freezeAccount = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
};

export const restoreAccount = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
};

export const hardDeleteAccount = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
};

export const updatePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }).required(),
};
