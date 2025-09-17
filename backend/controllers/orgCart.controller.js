import { asyncHandler, successResponse } from "../utils/response.js";
import OrgCartModel from "../DB/models/orgCart.model.js";
import Venue from "../DB/models/venue.js";
import UserModel from "../DB/models/user.model.js";
import Event from "../DB/models/event.js";

// 🔹 حساب السعر حسب الوقت أو التذكرة
const calcPrice = (start, end, pricePerHour) => {
  if (!start || !end) return 0;

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  if (isNaN(startHour) || isNaN(endHour)) return 0;

  let startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60; // اليوم اللي بعده
  }

  const diffMinutes = endTotalMinutes - startTotalMinutes;
  const diffHours = diffMinutes / 60;

  return diffHours * pricePerHour;
};

// 📦 Get all items by organizer
export const getAllItemByOrg = asyncHandler(async (req, res, next) => {
  const organizerId = req.user.id; // ✅ من التوكن

  const checkOrg = await UserModel.findOne({ _id: organizerId, role: "Organizer" });
  if (!checkOrg) return next(new Error("Organizer not found", { cause: 404 }));

  const cart = await OrgCartModel.findOne({ organizerId });
  if (!cart || !cart.item.length) {
    return next(new Error("No items in cart", { cause: 404 }));
  }

  const totalPrice = cart.item.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
  return successResponse({ res, data: { items: cart.item, totalPrice } });
});

// ➕ Add item (venue or event)
export const addItemToCart = asyncHandler(async (req, res, next) => {
  const organizerId = req.user.id; // ✅ من التوكن
  const { venueId, eventId, start, end } = req.body;

  const checkOrg = await UserModel.findOne({ _id: organizerId, role: "Organizer" });
  if (!checkOrg) return next(new Error("Organizer not found", { cause: 404 }));

  let itemPrice = 0;

  if (venueId) {
    const venue = await Venue.findById(venueId);
    if (!venue) return next(new Error("Venue not found", { cause: 404 }));
    itemPrice = calcPrice(start, end, venue.pricePerHour);
  } else if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) return next(new Error("Event not found", { cause: 404 }));
    itemPrice = event.time * event.ticketPrice;
  } else {
    return next(new Error("Either venueId or eventId is required", { cause: 400 }));
  }

  let cart = await OrgCartModel.findOne({ organizerId });
  if (!cart) {
    cart = new OrgCartModel({
      organizerId,
      item: [{ eventId, venueId, start, end, totalPrice: itemPrice, status: "pending" }],
    });
  } else {
    const exists = cart.item.some(
      (it) =>
        (eventId && it.eventId?.toString() === eventId) ||
        (venueId && it.venueId?.toString() === venueId)
    );
    if (exists) return next(new Error("Item already in cart", { cause: 400 }));

    cart.item.push({ eventId, venueId, start, end, totalPrice: itemPrice, status: "pending" });
  }

  await cart.save();
  const totalPrice = cart.item.reduce((sum, it) => sum + (it.totalPrice || 0), 0);

  return successResponse({ res, status: 201, data: { message: "Item added", cart, totalPrice } });
});

// 🗑 Delete entire cart
export const deleteCart = asyncHandler(async (req, res, next) => {
  const organizerId = req.user.id;

  const cart = await OrgCartModel.findOneAndDelete({ organizerId });
  return cart
    ? successResponse({ res, data: { message: "Cart deleted" } })
    : next(new Error("Cart not found", { cause: 404 }));
});

// ➖ Delete one item
export const deleteItemFromCart = asyncHandler(async (req, res, next) => {
  const organizerId = req.user.id;
  const { eventId, venueId } = req.body;

  const cart = await OrgCartModel.findOne({ organizerId });
  if (!cart) return next(new Error("Cart not found", { cause: 404 }));

  cart.item = cart.item.filter((e) => {
    if (eventId) return e.eventId?.toString() !== eventId;
    if (venueId) return e.venueId?.toString() !== venueId;
    return true;
  });

  await cart.save();
  return successResponse({ res, data: { message: "Item deleted", cart } });
});
