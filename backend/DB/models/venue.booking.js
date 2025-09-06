import Joi from "joi";
import mongoose from "mongoose";

const venueBookingSchema = new mongoose.Schema({
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Organizer id is required"],
    },
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: [true, "Venue id is required"],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category id is required"],
    },
    date: {
        type: Date,
        required: [true, "Booking date is required"],
    },
    time: {
        type: String,
        required: [true, "Booking time is required"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        min: [0, "Total price must be positive"],
    },
    status: {
        type: String,
        enum: ["pending", "payment", "confirmed", "cancelled"],
        default: "pending",
    },
    details: {
        type: String,
        trim: true,
        default: "",
    },
    bannerImage: {
        type: String,
        default: "",
    }
}, { timestamps: true });

export default mongoose.model("VenueBooking", venueBookingSchema);
