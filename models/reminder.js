import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  time: {
    type: String, // Example: "08:00"
    required: true,
  },
  day: {
    type: String, // "Everyday", "Weekdays", or "Monday"
    enum: [
      "Everyday",
      "Weekdays",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);
