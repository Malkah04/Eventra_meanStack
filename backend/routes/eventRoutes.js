import express from "express";
import * as eventController from "../controllers/eventController.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { eventValidation } from "../validation/event.validation.js";

const router = express.Router();

// Create event (Organizer فقط)
router.post(
  "/",
  authentication(),
  authorization([roleEnum.organizer]),
  validation(eventValidation.create),
  eventController.createEvent
);

// Get all events (عام)
router.get("/", eventController.getEvents);

// Get single event (عام)
router.get("/:id", validation(eventValidation.getById), eventController.getEventById);

// Update event (Organizer فقط + لازم يبقى هو اللي عمل الإيفنت)
router.patch(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer]),
  validation(eventValidation.update),
  eventController.updateEvent
);

// Delete event (Organizer بتاعه أو Admin)
router.delete(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(eventValidation.delete),
  eventController.deleteEvent
);

export default router;
