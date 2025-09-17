import { asyncHandler, successResponse } from "../utils/response.js";
import Venue from "../DB/models/venue.js";
import { roleEnum } from "../DB/models/user.model.js";

// =================== Create ====================
export const createVenue = asyncHandler(async (req, res, next) => {
  if (req.user.role === roleEnum.user) {
    return next(new Error("Not authorized to create a venue", { cause: 403 }));
  }

  const venue = await Venue.create({ ...req.body, ownerId: req.user._id });
  return successResponse({ res, status: 201, data: { venue } });
});

// =================== Get All ====================
export const getAllVenues = asyncHandler(async (req, res) => {
  if (req.query.categoryId) {
    const venues = await Venue.find({ categoryId: req.query.categoryId });
    return successResponse({ res, data: { venues } });
  }

  const venues = await Venue.find();
  return successResponse({ res, data: { venues } });
});

// =================== Get By Owner ====================
export const getVenuesByOwner = asyncHandler(async (req, res, next) => {
  if (req.query.categoryId) {
    const venues = await Venue.find({
      $or: [
        { ownerId: req.user._id },
        { ownerId: "68b864db4ca665eae8fd5d5f" }
      ],
      categoryId: req.query.categoryId
    });
    return successResponse({ res, data: { venues } });
  }
  const venues = await Venue.find({
    $or: [
      { ownerId: req.user._id },
      { ownerId: "68b864db4ca665eae8fd5d5f" }
    ]
  });
  if (!venues.length) return next(new Error("No venues found", { cause: 404 }));
  return successResponse({ res, data: { venues } });
});

// =================== Get By Id ====================
export const getVenueById = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id).populate('categoryId', 'name');
  if (!venue) return next(new Error("Venue not found", { cause: 404 }));

  return successResponse({ res, data: { venue } });
});

// =================== Update ====================
export const updateVenue = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) return next(new Error("Venue not found", { cause: 404 }));

  if (
    req.user.role === roleEnum.organizer &&
    venue.ownerId.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("Not authorized to update this venue", { cause: 403 })
    );
  }

  // نحذف ownerId لو اليوزر بعتو بالغلط
  if ("ownerId" in req.body) delete req.body.ownerId;

  Object.assign(venue, req.body);
  await venue.save();
  return successResponse({ res, data: { venue } });
});

// =================== Delete ====================
export const deleteVenue = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) return next(new Error("Venue not found", { cause: 404 }));

  if (
    req.user.role === roleEnum.organizer &&
    venue.ownerId.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("Not authorized to delete this venue", { cause: 403 })
    );
  }

  await venue.deleteOne();
  return successResponse({ res, message: "Venue deleted successfully" });
});

export const venueSearch = asyncHandler(async (req, res) => {
  const searchItem = req.params.searchItem;
  const result = await Venue.find({
    $or: [
      { name: { $regex: searchItem, $options: "i" } },
      { description: { $regex: searchItem, $options: "i" } },
      { features: { $regex: searchItem, $options: "i" } },
    ],
  });
  if (!result || result.length === 0) {
    return res.status(400).json({ message: "no item found" });
  }
  res.status(200).json({ result });
});
export const venueFilter = asyncHandler(async (req, res) => {
  const { price, closeTime, openTime, days, capacity } = req.query;
  let fil = {};
  if (price) fil.pricePerHour = { $lte: Number(price) };
  if (days) fil["availability.days"] = days;
  if (openTime) fil["availability.openTime"] = openTime;
  if (closeTime) fil["availability.closeTime"] = closeTime;
  if (capacity) fil.capacity = { $lte: Number(capacity) };

  const result = await Venue.find(fil);
  if (!result || result.length === 0) {
    return res.status(404).json({ message: "No venues found" });
  }
  res.status(200).json(result);
});
