import Joi from "joi";

export const createEventValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  date: Joi.date().required(),
  categoryId: Joi.string().hex().length(24).required(), // ObjectId
  venueId: Joi.string().hex().length(24).required(),
  organizerId: Joi.string().hex().length(24).required(),
});

export const updateEventValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  date: Joi.date(),
  categoryId: Joi.string().hex().length(24),
  venueId: Joi.string().hex().length(24),
  organizerId: Joi.string().hex().length(24),
});
