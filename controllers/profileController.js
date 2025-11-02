import Symptom from "../models/profileModel.js";
import axios from "axios";

const prepareMLData = (userSymptomData) => {
  const { symptoms, symptom_severity } = userSymptomData;
  const severityMap = { none: 0.0, mild: 0.33, moderate: 0.66, severe: 1.0 };
  const allSymptoms = [
    "fever", "cough", "sore_throat", "runny_nose", "breath_shortness", "fatigue",
    "headache", "body_pain", "appetite_loss", "nausea", "stomach_pain",
    "sleep_quality", "mood_swings", "anxiety", "irritability", "concentration_loss"
  ];
  const row = allSymptoms.map(symptom =>
    symptoms.includes(symptom) ? severityMap[symptom_severity] : 0
  );
  return { data: [row, row] };
};

export const addSymptomEntry = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.name || !data.gender || !data.DOB || !data.height || !data.weight || !data.country) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (data.DOB) data.DOB = new Date(data.DOB);
    if (!Array.isArray(data.symptoms)) data.symptoms = [];

    const newEntry = new Symptom({
      ...data,
      user: req.user._id
      });
    const savedEntry = await newEntry.save();

    const mlInput = prepareMLData(data);
    let mlResult = null;

    try {
      const response = await axios.post("https://healthsnap-94hb.onrender.com/predict", mlInput, { headers: { "Content-Type": "application/json" }, timeout: 60000 });
      mlResult = response.data;
    } catch (mlError) {
      console.error("ML model error:", mlError.message);
      if (mlError.response) console.error("Response data:", mlError.response.data);
      mlResult = { error: "ML service unavailable or returned an error" };
    }

    if (mlResult && mlResult.prediction) {
      savedEntry.prediction = mlResult.prediction;
      savedEntry.confidence = mlResult.confidence;
      await savedEntry.save();
    }

    res.status(201).json({
      success: true,
      message: "Symptom entry saved successfully",
      data: {
        entry: savedEntry,
        mlPrediction: mlResult
      }
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    res.status(500).json({
      success: false,
      message: "An error occurred while saving symptom entry",
      error: error.message
    });
  }
};
