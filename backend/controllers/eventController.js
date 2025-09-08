import { asyncHandler, successResponse } from "../utils/response.js";
import Event from "../DB/models/event.js";
import { roleEnum } from "../DB/models/user.model.js";

// =================== Create ====================
export const createEvent = asyncHandler(async (req, res, next) => {
  // نتأكد إنه مش مكرر قبل الإنشاء
  const existing = await Event.findOne({
    name: req.body.name,
    venueId: req.body.venueId,
    date: req.body.date,
  });
  if (existing) {
    return next(
      new Error("This event already exists for this venue on this date", {
        cause: 400,
      })
    );
  }

  const event = await Event.create({ ...req.body, organizerId: req.user._id });
  return successResponse({ res, status: 201, data: { event } });
});

// =================== Get All ====================
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");
  return successResponse({ res, data: { events } });
});

// =================== Get By Id ====================
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate("categoryId", "name")
    .populate("venueId", "name")
    .populate("organizerId", "firstName lastName email");
  if (!event) return next(new Error("Event not found", { cause: 404 }));
  return successResponse({ res, data: { event } });
});

// =================== Update ====================
export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  if (
    req.user.role === roleEnum.organizer &&
    event.organizerId.toString() !== req.user._id.toString()
  ) {
    return next(new Error("Not authorized to update this event", { cause: 403 }));
  }

  Object.assign(event, req.body);
  await event.save();
  return successResponse({ res, data: { event } });
});

// =================== Delete ====================
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new Error("Event not found", { cause: 404 }));

  if (
    req.user.role === roleEnum.organizer &&
    event.organizerId.toString() !== req.user._id.toString()
  ) {
    return next(new Error("Not authorized to delete this event", { cause: 403 }));
  }

  await event.deleteOne();
  return successResponse({ res, message: "Event deleted successfully" });
});
