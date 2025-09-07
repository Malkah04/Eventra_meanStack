import express from "express";
import * as bookingController from "../controllers/venue.booking.controller.js";
import { authentication, authorization } from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { bookingValidation } from "../validation/booking.validation.js";

const bookingRouter = express.Router();

// Create booking (Organizer فقط)
bookingRouter.post(
  "/",
  authentication(),
  authorization([roleEnum.organizer]),
  validation(bookingValidation.create),
  bookingController.createVenueBooking
);

// Get all bookings (Admin فقط)
bookingRouter.get(
  "/",
  authentication(),
  authorization([roleEnum.admin]),
  bookingController.getAllVenueBookings
);

// Get bookings by organizer (Organizer فقط)
bookingRouter.get(
  "/my",
  authentication(),
  authorization([roleEnum.organizer]),
  bookingController.getVenueBookingsByOrganizer
);

// Get booking by ID (Organizer أو Admin)
bookingRouter.get(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(bookingValidation.getById),
  bookingController.getVenueBookingById
);

// Update booking (Organizer أو Admin)
bookingRouter.patch(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(bookingValidation.update),
  bookingController.updateVenueBooking
);

// Delete booking (Organizer أو Admin)
bookingRouter.delete(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(bookingValidation.delete),
  bookingController.deleteVenueBooking
);

export default bookingRouter;
