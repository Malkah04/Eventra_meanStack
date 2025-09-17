import { asyncHandler, successResponse } from "../utils/response.js";
import Event from "../DB/models/event.js";
import { roleEnum } from "../DB/models/user.model.js";
import mongoose from "mongoose";

// =================== Create Event ====================
export const createEvent = asyncHandler(async (req, res, next) => {
  const existing = await Event.findOne({
    name: req.body.name,
    venueId: req.body.venueId,
    date: req.body.date,
  });
  if (existing) {
    return next(
      new Error("This event already exists for this venue on this date", { cause: 400 })
    );
  }

  const event = await Event.create({ ...req.body, organizerId: req.user._id });
  return successResponse({ res, status: 201, data: { event } });
});

// =================== Get All Events ====================
export const getEvents = asyncHandler(async (req, res) => {
  const { categoryId } = req.query;
  let filter = {};

  if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    filter.categoryId = new mongoose.Types.ObjectId(categoryId);
  }

  // Users عادي يشوفوا بس الأحداث المعتمدة
  if (req.user?.role === roleEnum.user) {
    filter.approved = true;
  }

  const events = await Event.find(filter)
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");

  return successResponse({ res, data: { events } });
});

// =================== Get Organizer's Own Events ====================
export const getMyEvents = asyncHandler(async (req, res, next) => {
  if (req.user.role !== roleEnum.organizer) {
    return next(new Error("Not authorized", { cause: 403 }));
  }
  const filter = { organizerId: req.user._id };
  if (req.query.categoryId) {
    filter.categoryId = req.query.categoryId;
  }
  const events = await Event.find(filter)
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");

  return successResponse({ res, data: { events } });
});

// =================== Get Event By Id ====================
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");
  if (!event) return next(new Error("Event not found", { cause: 404 }));
  return successResponse({ res, data: { event } });
});

// Get upcoming events (عام)
export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const now = new Date();

  const events = await Event.find({ date: { $gte: now }, approved: true })
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email")
    .sort({ date: 1 }); // أحدث الأحداث أولاً

  return successResponse({ res, data: { events } });
});

// =================== Update Event ====================
export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  if (req.user.role === roleEnum.organizer && event.organizerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to update this event", { cause: 403 }));
  }

  Object.assign(event, req.body);
  await event.save();
  return successResponse({ res, data: { event } });
});

// =================== Delete Event ====================
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  if (req.user.role === roleEnum.organizer && event.organizerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to delete this event", { cause: 403 }));
  }

  await event.deleteOne();
  return successResponse({ res, message: "Event deleted successfully" });
});

// =================== Search Events ====================
export const search = asyncHandler(async (req, res) => {
  const searchItem = req.params.searchItem;
  const result = await Event.find({
    $or: [
      { name: { $regex: searchItem, $options: "i" } },
      { description: { $regex: searchItem, $options: "i" } },
    ],
  });
  if (!result || result.length === 0) {
    return res.status(400).json({ message: "no item found" });
  }
  res.status(200).json({ result });
});

// =================== Filter Events ====================
export const filter = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice, time, date } = req.query;
  let fil = {};

  if (minPrice || maxPrice) {
    fil.ticketPrice = {};
    if (minPrice) fil.ticketPrice.$gte = Number(minPrice);
    if (maxPrice) fil.ticketPrice.$lte = Number(maxPrice);
  }

  if (time) fil.time = time;
  if (date) {
    fil.date = {};
    fil.date.$gte = new Date(date);
  }

  const result = await Event.find(fil)
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");

  if (!result || result.length === 0) {
    return res.status(404).json({ message: "No events found" });
  }

  res.status(200).json(result);
});
