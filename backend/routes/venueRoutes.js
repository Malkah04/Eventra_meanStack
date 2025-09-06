import express from "express";
import { createVenue, getAllVenues, getVenueById, updateVenue, getVenuesByAdmin, deleteVenue } from '../controllers/venueController.js';

const venueRouter = express.Router();

venueRouter.post('/', createVenue);
venueRouter.get('/', getAllVenues);
venueRouter.get('/admin', getVenuesByAdmin);
venueRouter.get('/:id', getVenueById);
venueRouter.patch('/:id', updateVenue);
venueRouter.delete('/:id', deleteVenue);

export default venueRouter;