import axios from "axios";
import Symptom from "../models/profileModel.js";

export const getPrediction = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid or missing 'data' array" });
    }

    const flaskUrl = "https://healthsnap-94hb.onrender.com/predict";

    const response = await axios.post(flaskUrl, { data });

    const { prediction, confidence } = response.data;

    const newRecord = await Symptom.create({
      ...req.body,
      prediction,
      confidence,
    });

    res.status(200).json({
      success: true,
      prediction,
      confidence,
      record: newRecord,
    });

  } catch (error) {
    console.error("Error communicating with ML model:", error.message);
    res.status(500).json({
      success: false,
      message: "Error communicating with ML model",
      error: error.message,
    });
  }
};
