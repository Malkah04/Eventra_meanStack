import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true },
  description: String,
  ticketPrice: {
    type: Number,
    required: true },
  date: { 
    type: Date, 
    required: true },
  time: {
    type: String, 
    required: true },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", 
    required: true },
  venueId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Venue", 
    required: true },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);