import joi from "joi";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/response.js";

export const generalFields = {
  fullName: joi.string().min(3).max(50),
  firstName: joi.string().min(2).max(20),
  lastName: joi.string().min(2).max(20),
  email: joi
    .string()
    .email({ minDomainSegments: 2 })
    .messages({ "string.email": "Invalid email format" }),
  password: joi
    .string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    .messages({ "string.pattern.base": "Password must be 8+ chars with upper, lower, digit" }),
  otp: joi.string().pattern(/^\d{4}$/),
  confirmPassword: joi.any().valid(joi.ref("password")).messages({ "any.only": "Passwords must match" }),
  phone: joi.string().pattern(/^(002|\+2)?01[0125][0-9]{8}$/),
  age: joi.number().integer().min(18).max(90),
  lang: joi.string().valid("en", "ar"),
  id: joi.string().custom((value, helper) => {
    if (!Types.ObjectId.isValid(value)) return helper.message("Invalid MongoDB ID");
    return value;
  }),
};

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const validationErrors = [];

    if (!schema || typeof schema !== "object") {
      return res.status(400).json({ message: "Validation schema is missing" });
    }

    for (const key of Object.keys(schema)) {
      const value = req[key] || {};
      const { error } = schema[key].validate(value, { abortEarly: false, allowUnknown: true });
      if (error) {
        validationErrors.push({
          key,
          details: error.details.map((ele) => ({ message: ele.message, path: ele.path[0] })),
        });
      }
    }

    if (validationErrors.length) {
      return res.status(400).json({ message: "Validation Error", errors: validationErrors });
    }

    return next();
  });
};
