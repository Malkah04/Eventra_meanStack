import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Admin ID is required"],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category ID is required"],
    },
    name: {
        type: String,
        required: true,
        trim: [true, "Name cannot be empty"],
    },
    location: {
        type: String,
        required: true,
        trim: [true, "Location cannot be empty"],
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be at least 1"],
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: [0, "Price must be positive"],
    },
    features: {
        type: [String], // ["WiFi", "Parking", "Stage", "AC", "On Nile"]
        default: [],
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    images: {
        type: [String],
        default: [],
    },
    availability: {
        openTime: { type: String },  // "09:00"
        closeTime: { type: String }, // "22:00"
        days: { type: [String], default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }
    }
}, { timestamps: true });

export default mongoose.model("Venue", venueSchema);