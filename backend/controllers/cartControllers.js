import * as DBService from "../DB/db.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import CartModel from "../DB/models/cart.js";

//  Add ticket to the cart
export const addToCart = asyncHandler(async (req, res, next) => {
  const { userID, eventID, quantity, price } = req.body;

  // Find active cart for user
  let cart = await CartModel.findOne({ userID, status: "active" });

  if (!cart) {
    // If there is no active cart, create a new one
    cart = new CartModel({
      userID,
      status: "active",
      items: [],
      totalAmount: 0,
    });
  }

  // Check if the ticket already exists in the cart
  const existingItem = cart.items.find(
    (item) => item.eventID.toString() === eventID
  );

  if (existingItem) {
    return res.status(400).json({ message: "item already in the cart" });
  } else {
    cart.items.push({
      eventID,
      quantity,
      price,
      subtotal: quantity * price,
    });
  }

  // Update the total amount
  cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
  await cart.save();

  return successResponse({ res, data: { cart }, status: 201 });
});

// ➖ Remove Ticket from Cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { userID, eventID } = req.body;

  const cart = await CartModel.findOne({ userID, status: "active" });

  if (!cart) return next(new Error("Cart not found", { cause: 404 }));

  // Remove the ticket
  cart.items = cart.items.filter((item) => item.eventID.toString() !== eventID);

  // Update total
  cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

  await cart.save();

  return successResponse({ res, data: { cart } });
});

//  Empty Cart
export const emptyCart = asyncHandler(async (req, res, next) => {
  const { userID } = req.body;

  const cart = await DBService.findOneAndUpdate({
    model: CartModel,
    filter: { userID, status: "active" },
    data: { $set: { items: [], totalAmount: 0 } },
  });

  return cart
    ? successResponse({ res, data: { cart } })
    : next(new Error("Cart not found", { cause: 404 }));
});

//  Get Cart by User
export const getCart = asyncHandler(async (req, res, next) => {
  const { userID } = req.params;

  const cart = await DBService.findOne({
    model: CartModel,
    filter: { userID, status: "active" },
    populate: ["items.eventID"], // to get data about event
  });

  return cart
    ? successResponse({ res, data: { cart } })
    : next(new Error("Cart not found", { cause: 404 }));
});

// Proceed to Payment
export const proceedToPayment = asyncHandler(async (req, res, next) => {
  const { userID } = req.body;

  const cart = await DBService.findOneAndUpdate({
    model: CartModel,
    filter: { userID, status: "active" },
    data: { $set: { status: "checkedOut" } },
  });

  return cart
    ? successResponse({ res, data: { cart, message: "Proceed to payment" } })
    : next(new Error("Cart not found", { cause: 404 }));
});
