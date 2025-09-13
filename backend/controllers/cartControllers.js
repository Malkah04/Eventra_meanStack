
import * as DBService from "../DB/db.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import CartModel from "../DB/models/cart.js";
import EventModel from "../DB/models/event.js"; // 👈 عشان نجيب السعر الحقيقي

//  Add ticket to the cart
export const addToCart = asyncHandler(async (req, res, next) => {
  const { userID, eventID, quantity } = req.body;

  // ✅ هجيب الـ event من الداتا بيز
  const event = await EventModel.findById(eventID);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  const price = event.price; // السعر الحقيقي من DB

  // Find active cart for user
  let cart = await CartModel.findOne({ userID, status: "active" });

  if (!cart) {
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
    return res.status(400).json({ message: "Item already in the cart" });
  } else {
    cart.items.push({
      eventID,
      quantity,
      price,
      subtotal: quantity * price,
    });
  }

  // Update total amount
  cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
  await cart.save();

  return successResponse({ res, data: { cart }, status: 201 });
});

// ➖ Remove Ticket from Cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { userID, eventID } = req.body;

  const cart = await CartModel.findOne({ userID, status: "active" });

  if (!cart) return next(new Error("Cart not found", { cause: 404 }));

  cart.items = cart.items.filter((item) => item.eventID.toString() !== eventID);
  cart.totalAmount = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

  await cart.save();

  return successResponse({ res, data: { cart } });
});

// ✏️ Update Quantity
export const updateQuantity = asyncHandler(async (req, res, next) => {
  const { userID, eventID, quantity } = req.body;

  if (quantity < 1) return next(new Error("Quantity must be at least 1"));

  const cart = await CartModel.findOne({ userID, status: "active" });
  if (!cart) return next(new Error("Cart not found", { cause: 404 }));

  const item = cart.items.find((item) => item.eventID.toString() === eventID);
  if (!item) return next(new Error("Item not found in cart", { cause: 404 }));

  // ✅ هجيب السعر من الـ event تاني (ضمان أمان)
  const event = await EventModel.findById(eventID);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  item.quantity = quantity;
  item.price = event.price;
  item.subtotal = quantity * event.price;

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
    populate: ["items.eventID"],
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
