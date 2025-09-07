import Joi from "joi";

export const addToCart = {
  body: Joi.object({
    userID: Joi.string().required(),
    eventID: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(0).required(),
  }),
};

export const removeFromCart = {
  body: Joi.object({
    userID: Joi.string().required(),
    eventID: Joi.string().required(),
  }),
};

export const emptyCart = {
  body: Joi.object({
    userID: Joi.string().required(),
  }),
};

export const getCart = {
  params: Joi.object({
    userID: Joi.string().required(),
  }),
};

export const checkout = {
  body: Joi.object({
    userID: Joi.string().required(),
  }),
};
