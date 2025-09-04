
import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const genderEnum = { male: "male", female: "female", other: "other" };

export const shareProfile = {
  params: joi.object().keys({ userId: generalFields.id.required() }).required(),
};

export const updateBasicProfile = {
  body: joi
    .object()
    .keys({
      firstName: generalFields.firstName,
      lastName: generalFields.lastName,
      age: generalFields.age,
      phone: generalFields.phone,
      gender: joi.string().valid(...Object.values(genderEnum)),
    })
    .required(),
};

export const freezeAccount = {
  params: joi.object().keys({ userId: generalFields.id.required() }).required(),
};

export const restoreAccount = {
  params: joi.object().keys({ userId: generalFields.id.required() }).required(),
};


export const updatePassword = {
  body: joi
    .object()
    .keys({
      oldPassword: generalFields.password.required(),
      newPassword: generalFields.password.required(),
    })
    .required(),
};
