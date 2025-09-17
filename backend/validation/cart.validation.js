import Joi from "joi";

// ➕ Add to Cart
export const addToCart = {
  body: Joi.object({
    eventID: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
  }),
};

// ✏️ Update Quantity
export const updateQuantity = {
  body: Joi.object({
    eventID: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
  }),
};

// ➖ Remove item from Cart
export const removeFromCart = {
  body: Joi.object({
    eventID: Joi.string().required(),
  }),
};

// 🗑 Empty Cart
export const emptyCart = {
  // لا حاجة ل body لأن userID يجي من التوكن
  body: Joi.object({}),
};

// 📦 Get User Cart
export const getCart = {
  // params فاضية لأن userID من التوكن
  params: Joi.object({}),
};

// 💳 Checkout
export const checkout = {
  // body فاضية لأن userID من التوكن
  body: Joi.object({}),
};
