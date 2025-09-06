import express from "express";
import { createVenueBooking, getAllVenueBookings, getVenueBookingsByOrganizer, getVenueBookingById, updateVenueBooking, deleteVenueBooking } from '../controllers/venue.booking.controller.js';

const venueRouter = express.Router();

venueRouter.post('/', createVenueBooking);
venueRouter.get('/', getAllVenueBookings);
venueRouter.get('/admin', getVenueBookingsByOrganizer);
venueRouter.get('/:id', getVenueBookingById);
venueRouter.patch('/:id', updateVenueBooking);
venueRouter.delete('/:id', deleteVenueBooking);

export default venueRouter;