import express from "express";
import * as venueController from "../controllers/venueController.js";
import {
  authentication,
  authorization,
} from "../middleware/authentication.middleware.js";
import { roleEnum } from "../DB/models/user.model.js";
import { validation } from "../middleware/validation.middleware.js";
import { venueValidation } from "../validation/venue.validation.js";

const venueRouter = express.Router();

// Create Venue (Organizer أو Admin)
venueRouter.post(
  "/",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(venueValidation.create),
  venueController.createVenue
);

// Get all venues (عام)
venueRouter.get("/", venueController.getAllVenues);

// Get venues owned by current Organizer/Admin
venueRouter.get(
  "/my",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  venueController.getVenuesByOwner
);

venueRouter.get("/filter", venueController.venueFilter);

// Get single venue (عام)
venueRouter.get(
  "/:id",
  validation(venueValidation.getById),
  venueController.getVenueById
);

// Update venue (Organizer/Admin لكن لازم يكون الـ owner أو Admin)
venueRouter.patch(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(venueValidation.update),
  venueController.updateVenue
);

// Delete venue (Organizer بتاعه أو Admin)
venueRouter.delete(
  "/:id",
  authentication(),
  authorization([roleEnum.organizer, roleEnum.admin]),
  validation(venueValidation.delete),
  venueController.deleteVenue
);

venueRouter.get("/search/:searchItem", venueController.venueSearch);

export default venueRouter;
