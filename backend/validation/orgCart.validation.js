import Joi from "joi";
import { generalFields } from "../middleware/validation.middleware.js";

export const orgCartValidation = {
  create: {
    body: Joi.object({
      organizerId: generalFields.id.required(),
      venueId: generalFields.id.optional(),
      eventId: generalFields.id.optional(),
      start: Joi.string().required(),
      end: Joi.string().required(),
    }),
  },
  getByOrgId: {
    params: Joi.object({ id: generalFields.id.required() }).required(),
  },
  deleteCart: {
    params: Joi.object({ id: generalFields.id.required() }).required(),
  },
  deleteItemInCart: {
    body: Joi.object({
      organizerId: generalFields.id.required(),
      venueId: generalFields.id.optional(),
      eventId: generalFields.id.optional(),
    }),
  },
};
