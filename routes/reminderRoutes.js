import express from "express";
import Reminder from "../models/reminder.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, async (req, res) => {
  try {
    const { title, description, time, day } = req.body;
    const reminder = new Reminder({
      user: req.user.id,
      title,
      description,
      time,
      day,
    });

    await reminder.save();
    res.status(201).json({ success: true, message: "Reminder created", reminder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating reminder", error: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reminders", error: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }
    res.status(200).json({ success: true, message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting reminder", error: error.message });
  }
});

export default router;
