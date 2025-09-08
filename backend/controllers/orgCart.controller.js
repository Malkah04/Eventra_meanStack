import { asyncHandler } from "../utils/response.js";
import orgCart from "../DB/models/orgCart.model.js";
import VenueBooking from "../DB/models/venue.booking.js";
import Venue from "../DB/models/venue.js";
import UserModel from "../DB/models/user.model.js";
import Event from "../DB/models/event.js";

const getAllItemByOrg = asyncHandler(async (req, res) => {
  const organizerId = req.params.id;
  const checkOrg = await UserModel.findOne({
    $and: [{ _id: organizerId, role: "Organizer" }],
  });
  if (!checkOrg) {
    return res.status(400).json({ message: "user not exist" });
  }
  const getCart = await orgCart.findOne({ organizerId });
  if (!getCart || !getCart.item || getCart.item.length === 0) {
    return res.status(400).json({ message: "no item in cart" });
  }
  res.status(200).json(getCart.item);
});

const calcPrice = (start, end, pricePerHour) => {
  const diffMs = end - start;
  return diffMs * pricePerHour;
};

const addItemToCart = asyncHandler(async (req, res) => {
  const { organizerId, venueId, eventId, start, end } = req.body;
  const checkOrg = await UserModel.findOne({
    $and: [{ _id: organizerId, role: "Organizer" }],
  });
  if (!checkOrg) {
    return res.status(400).json({ message: "user not exist" });
  }
  let lastPrice = 0;
  if (venueId) {
    const checkVen = await Venue.findById(venueId);
    if (!checkVen) {
      return res.status(400).json({ message: "no venue" });
    }
    lastPrice = calcPrice(start, end, checkVen.pricePerHour);
  } else if (eventId) {
    const checkEv = await Event.findById(eventId);
    if (!checkEv) {
      return res.status(400).json({ message: "no event" });
    }
    lastPrice = checkEv.time * checkEv.ticketPrice;
  }
  let cart = await orgCart.findOne({ organizerId });
  if (!cart) {
    cart = new orgCart({
      organizerId,
      item: [
        {
          eventId,
          venueId,
          totalPrice: lastPrice,
          status: "pending",
          startTime: start,
          endTime: end,
        },
      ],
    });
  } else {
    const alreadyExists = cart.item.some(
      (it) =>
        (eventId && it.eventId?.toString() === eventId) ||
        (venueId && it.venueId?.toString() === venueId)
    );

    if (alreadyExists) {
      return res.status(400).json({ message: "item already in cart" });
    }

    cart.item.push({
      eventId,
      venueId,
      totalPrice: lastPrice,
      status: "pending",
      startTime: start,
      endTime: end,
    });
  }
  await cart.save();
  return res
    .status(201)
    .json({ message: "Item added to cart successfully", cart });
});

const deleteCart = asyncHandler(async (req, res) => {
  const organizerId = req.params.id;
  const checkOrg = await UserModel.findOne({
    $and: [{ _id: organizerId, role: "Organizer" }],
  });
  if (!checkOrg) {
    return res.status(400).json({ message: "user not exist" });
  }

  let cart = await orgCart.findOne({ organizerId });
  if (!cart) {
    return res.status(400).json({ message: "no cart" });
  }
  await orgCart.findOneAndDelete({ organizerId });
  return res.status(200).json({ message: "Cart deleted successfully" });
});

const deleteItemFromCart = asyncHandler(async (req, res) => {
  const { organizerId, eventId, venueId } = req.body;
  const checkOrg = await UserModel.findOne({
    $and: [{ _id: organizerId, role: "Organizer" }],
  });
  if (!checkOrg) {
    return res.status(400).json({ message: "user not exist" });
  }

  if (venueId) {
    const checkVen = await Venue.findById(venueId);
    if (!checkVen) {
      return res.status(400).json({ message: "no venue" });
    }
  } else if (eventId) {
    const checkEv = await Event.findById(eventId);
    if (!checkEv) {
      return res.status(400).json({ message: "no event" });
    }
  } else {
    return res.status(400).json({ message: "eventId or venueId is required" });
  }

  const cart = await orgCart.findOne({ organizerId });
  if (!cart) {
    return res.status(400).json({ message: "no cart" });
  }

  cart.item = cart.item.filter((e) => {
    if (eventId) return e.eventId?.toString() !== eventId;
    if (venueId) return e.venueId?.toString() !== venueId;
    return true;
  });
  await cart.save();
  return res.status(200).json({ message: "item deleted successfully", cart });
});

export { deleteCart, deleteItemFromCart, addItemToCart, getAllItemByOrg };
