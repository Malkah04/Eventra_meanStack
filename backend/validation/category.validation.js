import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const categoryValidation = {
  create: {
    body: joi.object({
      name: joi.string().min(3).max(50).required(),
      description: joi.string().max(500),
    }).required(),
  },

  update: {
    body: joi.object({
      name: joi.string().min(3).max(50),
      description: joi.string().max(500),
    }).min(1).required(),
    params: joi.object({
      id: generalFields.id.required(),
    }).required(),
  },

  getById: {
    params: joi.object({
      id: generalFields.id.required(),
    }).required(),
  },

  delete: {
    params: joi.object({
      id: generalFields.id.required(),
    }).required(),
  },
};
