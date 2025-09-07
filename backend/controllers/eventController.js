import * as DBService from "../DB/db.service.js";
import { asyncHandler, successResponse } from "../utils/response.js";
import { EventModel } from "../DB/models/event.js";

// ================= Create Event =================
export const createEvent = asyncHandler(async (req, res, next) => {
  const event = await DBService.create({
    model: EventModel,
    data: req.body,
  });

  return successResponse({ res, data: { event }, status: 201 });
});

// ================= Get All Events =================
export const getEvents = asyncHandler(async (req, res) => {
  const events = await DBService.find({
    model: EventModel,
    populate: [
      { path: "categoryId", select: "name" },
      { path: "venueId", select: "name" },
      { path: "organizerId", select: "name" },
    ],
  });

  return successResponse({ res, data: { events } });
});

// ================= Get Event By ID =================
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await DBService.findById({
    model: EventModel,
    id: req.params.id,
    populate: [
      { path: "categoryId", select: "name" },
      { path: "venueId", select: "name" },
      { path: "organizerId", select: "name" },
    ],
  });

  return event
    ? successResponse({ res, data: { event } })
    : next(new Error("Event not found", { cause: 404 }));
});

// ================= Update Event =================
export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await DBService.findOneAndUpdate({
    model: EventModel,
    filter: { _id: req.params.id },
    data: { $set: req.body, $inc: { __v: 1 } },
  });

  return event
    ? successResponse({ res, data: { event } })
    : next(new Error("Event not found", { cause: 404 }));
});

// ================= Delete Event =================
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const result = await DBService.deleteOne({
    model: EventModel,
    filter: { _id: req.params.id },
  });

  return result.deletedCount
    ? successResponse({ res, data: { deletedCount: result.deletedCount } })
    : next(new Error("Event not found", { cause: 404 }));
});
