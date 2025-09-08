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
  const venues = await Venue.find();
  return successResponse({ res, data: { venues } });
});

// =================== Get By Owner ====================
export const getVenuesByOwner = asyncHandler(async (req, res, next) => {
  const venues = await Venue.find({ ownerId: req.user._id });
  if (!venues.length) return next(new Error("No venues found", { cause: 404 }));
  return successResponse({ res, data: { venues } });
});

// =================== Get By Id ====================
export const getVenueById = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) return next(new Error("Venue not found", { cause: 404 }));
  return successResponse({ res, data: { venue } });
});

// =================== Update ====================
export const updateVenue = asyncHandler(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) return next(new Error("Venue not found", { cause: 404 }));

  if (req.user.role === roleEnum.organizer && venue.ownerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to update this venue", { cause: 403 }));
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

  if (req.user.role === roleEnum.organizer && venue.ownerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to delete this venue", { cause: 403 }));
  }

  await venue.deleteOne();
  return successResponse({ res, message: "Venue deleted successfully" });
});
