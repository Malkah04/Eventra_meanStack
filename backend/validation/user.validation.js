import Joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";
import { genderEnum } from "../DB/models/user.model.js";

export const shareProfile = {
  params: Joi.object({ userId: generalFields.id.required() }).required(),
};

export const updateBasicProfile = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(20).optional().allow(""),
    lastName: Joi.string().min(2).max(20).optional().allow(""),
    phone: Joi.string().min(8).max(15).optional().allow(""),
    gender: Joi.string().valid(...Object.values(genderEnum)).optional().allow(""),
    bio: Joi.string().max(500).optional().allow(""),
  }).unknown(true) //  عشان يقبل أي field تاني (زي avatar)
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
