import { asyncHandler, successResponse } from "../utils/response.js";
import VenueBooking from "../DB/models/venue.booking.js";
import { roleEnum } from "../DB/models/user.model.js";

// =================== Create Booking ====================
export const createVenueBooking = asyncHandler(async (req, res) => {
  const booking = await VenueBooking.create({
    ...req.body,
    organizerId: req.user._id, // من التوكن
  });

  return successResponse({ res, status: 201, data: { booking } });
});

// =================== Get All Bookings (Admin only) ====================
export const getAllVenueBookings = asyncHandler(async (req, res, next) => {
  if (req.user.role !== roleEnum.admin) {
    return next(new Error("Only admin can view all bookings", { cause: 403 }));
  }

  const bookings = await VenueBooking.find()
    .populate("venueId categoryId organizerId", "name");
  return successResponse({ res, data: { bookings } });
});

// =================== Get Bookings By Organizer ====================
export const getVenueBookingsByOrganizer = asyncHandler(async (req, res) => {
  const bookings = await VenueBooking.find({ organizerId: req.user._id })
    .populate("venueId categoryId", "name");
  return successResponse({ res, data: { bookings } });
});

// =================== Get Booking By Id ====================
export const getVenueBookingById = asyncHandler(async (req, res, next) => {
  const booking = await VenueBooking.findById(req.params.id);
  if (!booking) return next(new Error("Booking not found", { cause: 404 }));
  return successResponse({ res, data: { booking } });
});

// =================== Update Booking ====================
export const updateVenueBooking = asyncHandler(async (req, res, next) => {
  const booking = await VenueBooking.findById(req.params.id);
  if (!booking) return next(new Error("Booking not found", { cause: 404 }));

  if (req.user.role === roleEnum.organizer && booking.organizerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to update this booking", { cause: 403 }));
  }

  Object.assign(booking, req.body);
  await booking.save();
  return successResponse({ res, data: { booking } });
});

// =================== Delete Booking ====================
export const deleteVenueBooking = asyncHandler(async (req, res, next) => {
  const booking = await VenueBooking.findById(req.params.id);
  if (!booking) return next(new Error("Booking not found", { cause: 404 }));

  if (req.user.role === roleEnum.organizer && booking.organizerId.toString() !== req.user._id.toString()) {
    return next(new Error("Not authorized to delete this booking", { cause: 403 }));
  }

  await booking.deleteOne();
  return successResponse({ res, message: "Booking deleted successfully" });
});
