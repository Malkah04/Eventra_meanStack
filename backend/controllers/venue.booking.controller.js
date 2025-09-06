import { verifyToken } from "../utils/security/token.security.js";
import VenueBooking from "../DB/models/venue.booking.js";


// Create a new venue booking
const createVenueBooking = async (req, res) => {
    const { venueId, categoryId, date, time, totalPrice, details, bannerImage } = req.body;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    let decoded;
    try {
        decoded = verifyToken({
            token: token,
            signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    const organizerId = decoded._id;
    const userRole = decoded.role;

    if (!organizerId || userRole.toLowerCase() === "user") {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    // Validation
    let errors = [];
    if (!venueId) errors.push("Venue ID is required");
    if (!categoryId) errors.push("Category ID is required");
    if (!date) errors.push("Booking date is required");
    if (!time) errors.push("Booking time is required");
    if (!totalPrice) errors.push("Total price is required");

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    VenueBooking.create({ organizerId, venueId, categoryId, date, time, totalPrice, details, bannerImage })
        .then((booking) => res.status(200).json({ success: true, booking }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                let validationErrors = [];
                Object.keys(err.errors).forEach((key) => {
                    validationErrors.push(err.errors[key].message);
                });
                return res.status(400).json({ success: false, errors: validationErrors });
            } else {
                console.error(err);
                return res.status(500).json({ success: false, error: "Server error" });
            }
        });
};

// Get all venues bookings
const getAllVenueBookings = async (req, res) => {
    VenueBooking.find().then((bookings) => {
        res.status(200).json({ success: true, bookings });
    }).catch((error) => {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    });
};

// Get venues bookings by organizer ID
const getVenueBookingsByOrganizer = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    let decoded;
    try {
        decoded = verifyToken({
            token: token,
            signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
        });
    } catch (err) {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    const organizerId = decoded._id;
    const userRole = decoded.role;

    if (!organizerId || userRole.toLowerCase() === "user") {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    VenueBooking.find({ organizerId: organizerId }).then((bookings) => {
        res.status(200).json({ success: true, venueBooking: bookings });
    }).catch((error) => {
        console.error(error);
        return res.status(500).json({ success: false, error: "Server error" });
    });
};

// Get venue booking by its ID
const getVenueBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await VenueBooking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, error: "Venue booking not found" });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// Update a venue
const updateVenueBooking = async (req, res) => {
    const bookingId = req.params.id;
    const token = req.headers.authorization;
    const {
        venueId,
        categoryId,
        date,
        time,
        totalPrice,
        details,
        bannerImage
    } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });

    const organizerId = decoded._id;
    const userRole = decoded.role;

    if (!organizerId || userRole.toLowerCase() === "user") {
        return res.status(401).json({ success: false, error: "You are not authorized" });
    }

    if (!bookingId) {
        return res.status(400).json({ success: false, error: "Booking ID is required" });
    }

    if (!venueId && !categoryId && !date && !time && !totalPrice && !details && !bannerImage) {
        return res.status(400).json({ success: false, error: "At least one field is required to update" });
    }

    const newBooking = { venueId, categoryId, date, time, totalPrice, details, bannerImage };

    // Remove undefined/null fields
    Object.keys(newBooking).forEach((key) => {
        if (newBooking[key] === undefined || newBooking[key] === null) {
            delete newBooking[key];
        }
    });

    VenueBooking.updateOne({ _id: bookingId, organizerId: organizerId }, newBooking).then((result) => {
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: "Booking not found or you are not authorized to update this booking"
            });
        }
        res.status(200).json({ success: true, message: "Booking updated successfully" });
    }).catch((error) => {
        if (error.name === "ValidationError") {
            let validationErrors = [];
            Object.keys(error.errors).forEach((key) => {
                validationErrors.push(error.errors[key].message);
            });
            return res.status(400).json({ success: false, errors: validationErrors });
        } else {
            console.log(error);
            return res.status(500).json({ success: false, error: "Server error" });
        }
    });
};

// Delete a venue
const deleteVenueBooking = async (req, res) => {
    const bookingId = req.params.id,
        token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });
    const organizerId = decoded._id;
    const userRole = decoded.role;

    if (!organizerId || userRole.toLowerCase() === "user") {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    if (!bookingId) {
        return res.status(400).json({ success: false, error: "Venue booking ID is required" });
    }
    VenueBooking.deleteOne({ _id: bookingId, organizerId: organizerId }).then((result) => {
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: "Venue booking not found or you are not autherized to delete this venue" });
        }
        res.status(200).json({ success: true, message: "Venue booking deleted successfully" });
    }).catch((error) => {
        res.status(500).json({ success: false, error: "Server error" });
        console.log(error)
    });
}

export {
    createVenueBooking,
    getAllVenueBookings,
    getVenueBookingsByOrganizer,
    getVenueBookingById,
    updateVenueBooking,
    deleteVenueBooking
};