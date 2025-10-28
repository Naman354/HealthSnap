import Symptom from "../models/profileModel.js";

export const addSymptomEntry = async (req, res) => {
  try {
    const {
      name,
      gender,
      DOB,
      relationship,
      height,
      weight,
      country,
      diet_type,
      sleep_quality,
      hydration_level,
      stress_level,
      smoking,
      alcohol_intake,
      symptoms,
      symptom_severity,
      details,
      steps_walked,
      sleep_hours,
      water_intake,
      BMI,
      heart_rate,
      calorie_intake,
    } = req.body;

    const newEntry = new Symptom({
      name,
      gender,
      DOB,
      relationship,
      height,
      weight,
      country,
      diet_type,
      sleep_quality,
      hydration_level,
      stress_level,
      smoking,
      alcohol_intake,
      symptoms,
      symptom_severity,
      details,
      steps_walked,
      sleep_hours,
      water_intake,
      BMI,
      heart_rate,
      calorie_intake,
    });

    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
