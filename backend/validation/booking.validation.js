import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const bookingValidation = {
  create: {
    body: joi.object({
      organizerId: generalFields.id.required(),
      venueId: generalFields.id.required(),
      categoryId: generalFields.id.required(),
      date: joi.date().greater("now").required(),
      time: joi.string().required(),
      totalPrice: joi.number().min(0).required(),
      details: joi.string().max(1000),
      bannerImage: joi.string().uri(),
    }).required(),
  },

  update: {
    body: joi.object({
      organizerId: generalFields.id,
      venueId: generalFields.id,
      categoryId: generalFields.id,
      date: joi.date().greater("now"),
      time: joi.string(),
      totalPrice: joi.number().min(0),
      details: joi.string().max(1000),
      bannerImage: joi.string().uri(),
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
