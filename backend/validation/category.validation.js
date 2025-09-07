import Joi from "joi";

export const createCategoryValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

export const updateCategoryValidation = Joi.object({
  name: Joi.string().min(2).max(50),
});
