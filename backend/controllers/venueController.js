import { verifyToken } from "../utils/security/token.security.js";
import Venue from "../DB/models/venue.js";


// Create a new venue
const createVenue = async (req, res) => {
    const categoryId = req.body.categoryId,
        name = req.body.name,
        location = req.body.location,
        capacity = req.body.capacity,
        pricePerHour = req.body.pricePerHour,
        features = req.body.features,
        description = req.body.description,
        images = req.body.images,
        token = req.headers.autherization,
        availability = req.body.availability;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not authorized 1" });
    }
    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });

    const adminId = decoded._id;
    const userRole = decoded.role;

    if (!adminId || userRole.toLowerCase() !== "admin") {
        return res.status(401).json({ success: false, error: "You are not autherized 2" });
    }

    if (!categoryId) {
        return res.status(400).json({ success: false, error: "Category ID is required" });
    }
    let errors = [];

    if (!name) {
        errors.push("Name is required");
    }
    if (!location) {
        errors.push("Location is required");
    }
    if (!capacity) {
        errors.push("Capacity is required");
    }
    if (!pricePerHour) {
        errors.push("Price per hour is required");
    }

    if (errors.length !== 0) {
        return res.status(400).json({ success: false, errors: errors });
    }

    Venue.create({
        adminId,
        categoryId,
        name,
        location,
        capacity,
        pricePerHour,
        features,
        description,
        images,
        availability
    }).then(
        (venue) => res.status(200).json({ success: true, venue })
    ).catch((errors) => {
        if (errors.name == "ValidationError") {
            let validationErrors = [];
            Object.keys(errors.errors).forEach((key) => {
                validationErrors.push(errors.errors[key].message);
            });
            return res.status(400).json({ success: false, errors: validationErrors });
        } else {
            return res.status(500).json({ success: false, error: "Server error" });
        }
    });
}

// Get all venues
const getAllVenues = async (req, res) => {
    Venue.find().then(
        (venues) => res.status(200).json({ success: true, venues })
    ).catch((error) => {
        res.status(500).json({ success: false, error: "Server error" });
        console.log(error)
    });
}

// Get venues by admin ID
const getVenuesByAdmin = async (req, res) => {
    const token = req.headers.autherization;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });
    const adminId = decoded._id;
    const userRole = decoded.role;

    if (!adminId || userRole.toLowerCase() !== "admin") {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }

    Venue.find({ adminId: adminId }).then(
        (venues) => {
            if (venues && venues.length !== 0) {
                res.status(200).json({ success: true, venues })
            } else {
                res.status(404).json({ success: false, error: "No venues yet" })
            }
        }
    ).catch((error) => {
        res.status(500).json({ success: false, error: "Server error" });
        console.log(error)
    });
}

// Get venue by its ID
const getVenueById = async (req, res) => {
    const venueId = req.params.id;
    Venue.findById(venueId).then((venue) => {
        if (!venue) {
            return res.status(404).json({ success: false, error: "Venue not found" });
        }
        res.status(200).json({ success: true, venue })
    }
    ).catch((error) => {
        res.status(500).json({ success: false, error: "Server error" });
        console.log(error)
    });
}

// Update a venue
const updateVenue = async (req, res) => {
    const venueId = req.params.id,
        categoryId = req.body.categoryId,
        name = req.body.name,
        location = req.body.location,
        capacity = req.body.capacity,
        pricePerHour = req.body.pricePerHour,
        features = req.body.features,
        description = req.body.description,
        images = req.body.images,
        availability = req.body.availability,
        token = req.headers.autherization;

    if (!token) {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });
    const adminId = decoded._id;
    const userRole = decoded.role;

    if (!adminId || userRole.toLowerCase() !== "admin") {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    if (!venueId) {
        return res.status(400).json({ success: false, error: "Venue ID is required" });
    }

    if (!categoryId && !name && !location && !capacity && !pricePerHour && !features && !description && !images && !availability) {
        return res.status(400).json({ success: false, error: "At least one field is required to update" });
    }

    const newVenue = {
        categoryId,
        name,
        location,
        capacity,
        pricePerHour,
        features,
        description,
        images,
        availability,
    }
    Object.keys(newVenue).forEach((key) => {
        if (newVenue[key] === undefined || newVenue[key] === null) {
            delete newVenue[key];
        }
    });

    Venue.updateOne({ _id: venueId, adminId: adminId }, newVenue).then((result) => {
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: "Venue not found or you are not autherized to update this venue" });
        }
        res.status(200).json({ success: true, message: "Venue updated successfully" });
    }).catch((error) => {
        if (error.name == "ValidationError") {
            let validationErrors = [];
            Object.keys(error.errors).forEach((key) => {
                validationErrors.push(error.errors[key].message);
            });
            return res.status(400).json({ success: false, errors: validationErrors });
        } else {
            console.log(error)
            return res.status(500).json({ success: false, error: "Server error" });
        }
    });
}

// Delete a venue
const deleteVenue = async (req, res) => {
    const venueId = req.params.id,
        token = req.headers.autherization;
    if (!token) {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    const decoded = verifyToken({
        token: token,
        signature: process.env.REFRESH_TOKEN_USER_SIGNATURE
    });
    const adminId = decoded._id;
    const userRole = decoded.role;

    if (!adminId || userRole.toLowerCase() !== "admin") {
        return res.status(401).json({ success: false, error: "You are not autherized" });
    }
    if (!venueId) {
        return res.status(400).json({ success: false, error: "Venue ID is required" });
    }
    Venue.deleteOne({ _id: venueId, adminId: adminId }).then((result) => {
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: "Venue not found or you are not autherized to delete this venue" });
        }
        res.status(200).json({ success: true, message: "Venue deleted successfully" });
    }).catch((error) => {
        res.status(500).json({ success: false, error: "Server error" });
        console.log(error)
    });
}

export {
    createVenue,
    getAllVenues,
    getVenuesByAdmin,
    getVenueById,
    updateVenue,
    deleteVenue
};