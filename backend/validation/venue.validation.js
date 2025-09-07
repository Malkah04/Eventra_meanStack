import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const venueValidation = {
  create: {
    body: joi.object({
      ownerId: generalFields.id.required(),
      categoryId: generalFields.id.required(),
      name: joi.string().min(3).max(100).required(),
      location: joi.object({
        x: joi.number().required(),
        y: joi.number().required(),
      }).required(),
      capacity: joi.number().min(1).required(),
      pricePerHour: joi.number().min(0).required(),
      features: joi.array().items(joi.string()),
      description: joi.string().max(1000),
      images: joi.array().items(joi.string().uri()),
      availability: joi.object({
        openTime: joi.string(),
        closeTime: joi.string(),
        days: joi.array().items(joi.string()),
      }),
    }).required(),
  },

  update: {
    body: joi.object({
      ownerId: generalFields.id,
      categoryId: generalFields.id,
      name: joi.string().min(3).max(100),
      location: joi.object({
        x: joi.number(),
        y: joi.number(),
      }),
      capacity: joi.number().min(1),
      pricePerHour: joi.number().min(0),
      features: joi.array().items(joi.string()),
      description: joi.string().max(1000),
      images: joi.array().items(joi.string().uri()),
      availability: joi.object({
        openTime: joi.string(),
        closeTime: joi.string(),
        days: joi.array().items(joi.string()),
      }),
    }).min(1).required(),
    params: joi.object({ id: generalFields.id.required() }).required(),
  },

  getById: {
    params: joi.object({ id: generalFields.id.required() }).required(),
  },

  delete: {
    params: joi.object({ id: generalFields.id.required() }).required(),
  },
};
