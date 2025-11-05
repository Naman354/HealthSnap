import Symptom from "../models/profileModel.js";
import axios from "axios";
import validator from "validator";

const prepareMLData1 = (userSymptomData) => {
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

const prepareMLData2 = (userSymptomData) => {
  const { weight, height, sleep_hours, water_intake, steps_walked } = userSymptomData;

  const dummy = {
    user_id: Math.floor(Math.random() * 10000) + 1,
    age: 30,
    weight: weight || 70,
    height: height || 170,
    bmi: (weight && height) ? +(weight / ((height / 100) ** 2)).toFixed(2) : 24.2,
    sleep_hours: sleep_hours || 7,
    water_intake: water_intake || 5,
    exercise_minutes: 30,
    daily_steps: steps_walked || 8000,
    screen_time_hours: 6,
    clicks_last_7_days: 5,
    avg_tip_rating: 4,
    days_since_registration: 200,
    days_since_last_engagement: 3,
    headache: userSymptomData.symptoms.includes("headache") ? 1 : 0,
    fatigue: userSymptomData.symptoms.includes("fatigue") ? 1 : 0,
    stress: userSymptomData.stress_level === "High" ? 1 : 0,
    muscle_pain: userSymptomData.symptoms.includes("body_pain") ? 1 : 0,
    digestive_issues: userSymptomData.symptoms.includes("stomach_pain") ? 1 : 0,
    poor_sleep: userSymptomData.sleep_quality === "Low" ? 1 : 0,
    low_energy: userSymptomData.symptoms.includes("fatigue") ? 1 : 0,
    anxiety: userSymptomData.symptoms.includes("anxiety") ? 1 : 0,
    back_pain: 0,
    neck_pain: 0,
    hydration_index: 0,
    sleep_quality_score: 0,
    workout_frequency: 0
  };

  return { features: Object.values(dummy) };
};

export const addSymptomEntry = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized user" });
    }
    if (!data.name || !data.gender || !data.DOB || !data.height || !data.weight || !data.country) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    data.name = data.name.trim();
    data.country = data.country.trim();
    if (data.details) data.details = validator.escape(data.details.trim());
    if (data.relationship) data.relationship = data.relationship.trim();
    
    if (data.height < 0 || data.height > 300)
    return res.status(400).json({ success: false, message: "Invalid height value" });

    if (data.weight < 0 || data.weight > 200)
    return res.status(400).json({ success: false, message: "Invalid weight value" });

    if (data.sleep_hours && (data.sleep_hours < 0 || data.sleep_hours >  24))
    return res.status(400).json({ success: false, message: "Invalid sleep hours" });
    if (isNaN(new Date(data.DOB).getTime())) {
    return res.status(400).json({ success: false, message: "Invalid date format for DOB" });
    }

    if (data.DOB) data.DOB = new Date(data.DOB);
    if (new Date(data.DOB) > new Date()) {
    return res.status(400).json({ success: false, message: "DOB cannot be in the future" });
    }

    for (const key of ["height", "weight", "sleep_hours", "water_intake", "steps_walked"]) {
    if (data[key] === undefined || data[key] === null) data[key] = 0;
    }

  if (!Array.isArray(data.symptoms)) data.symptoms = [];

    const validEnums = {
  gender: ["Male", "Female", "Other"],
  diet_type: ["Vegan", "Vegetarian", "Non Vegetarian"],
  sleep_quality: ["Low", "Normal", "High"],
  hydration_level: ["Low", "Normal", "High"],
  stress_level: ["Low", "Normal", "High"],
  smoking: ["Yes", "No"],
  alcohol_intake: ["Occasionally", "Regularly", "Never"],
  symptom_severity: ["none", "mild", "moderate", "severe"],
};
    const allowedSymptoms = [
  "fever", "cough", "sore_throat", "runny_nose", "breath_shortness", "fatigue",
  "headache", "body_pain", "appetite_loss", "nausea", "stomach_pain",
  "sleep_quality", "mood_swings", "anxiety", "irritability", "concentration_loss"
];

  if (data.symptoms.some(s => !allowedSymptoms.includes(s))) {
    return res.status(400).json({ success: false, message: "Invalid symptom detected" });
    }

for (const [key, allowed] of Object.entries(validEnums)) {
  if (data[key] && !allowed.includes(data[key])) {
    return res.status(400).json({ success: false, message: `Invalid value for ${key}` });
  }
}


    const newEntry = new Symptom({
      ...data,
      user: req.user._id,
    });
    const savedEntry = await newEntry.save();

    const mlInput1 = prepareMLData1(data);
    let mlResult1 = {};
    try {
      const resp1 = await axios.post("https://healthsnap-94hb.onrender.com/predict", mlInput1, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000
      });
      mlResult1 = resp1.data;
    } catch (err) {
      console.error("Model 1 error:", err.message);
      mlResult1 = { error: "Model 1 unavailable" };
    }

    const mlInput2 = prepareMLData2(data);
    let mlResult2 = {};
    try {
      const resp2 = await axios.post("https://snap-l53j.onrender.com/predict", mlInput2, {
        headers: { "Content-Type": "application/json" },
        timeout: 60000
      });
      mlResult2 = resp2.data;
    } catch (err) {
      console.error("Model 2 error:", err.message);
      mlResult2 = { error: "Model 2 unavailable" };
    }

    savedEntry.prediction = mlResult1.prediction || null;
    savedEntry.confidence = mlResult1.confidence || null;
    savedEntry.prediction_2 = mlResult2.prediction || null;
    savedEntry.confidence_2 = mlResult2.probability || null;
    await savedEntry.save();

    res.status(201).json({
      success: true,
      message: "Symptom entry saved and processed successfully",
      data: {
        entry: savedEntry,
        model_1: mlResult1,
        model_2: mlResult2
      }
    });
  } catch (error) {
    console.error("Error in addSymptomEntry:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving symptom entry",
      error: error.message
    });
  }
};
