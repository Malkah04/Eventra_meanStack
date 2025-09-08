import joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const eventValidation = {
  create: {
    body: joi
      .object({
        name: joi.string().min(3).max(100).required(),
        description: joi.string().max(1000),
        ticketPrice: joi.number().min(0).required(),
        date: joi.date().greater("now").required(),
        time: joi.string().required(),
        categoryId: generalFields.id.required(),
        venueId: generalFields.id.required(),
        // organizerId مش هنطلبه من العميل لأننا بنجيبه من req.user
      })
      .required(),
  },

  update: {
    body: joi
      .object({
        name: joi.string().min(3).max(100),
        description: joi.string().max(1000),
        ticketPrice: joi.number().min(0),
        date: joi.date().greater("now"),
        time: joi.string(),
        categoryId: generalFields.id,
        venueId: generalFields.id,
        // organizerId: generalFields.id, // مش لازم فى update كمان
      })
      .min(1)
      .required(),
    params: joi.object({ id: generalFields.id.required() }).required(),
  },

  getById: {
    params: joi.object({ id: generalFields.id.required() }).required(),
  },

  delete: {
    params: joi.object({ id: generalFields.id.required() }).required(),
  },
};
