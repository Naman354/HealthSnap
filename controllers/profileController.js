import Symptom from "../models/profileModel.js";

export const addSymptomEntry = async (req, res) => {
  try {
    const data = {...req.body};

    if (!data.name || !data.gender || !data.DOB || !data.height || !data.weight || !data.country) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (data.DOB) data.DOB = new Date(data.DOB);
    if (!Array.isArray(data.symptoms)) data.symptoms = [];

    const newEntry = new Symptom(data);
    const savedEntry = await newEntry.save();
    res.status(201).json({ success: true, data: savedEntry });
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
    res.status(400).json({ success: false, message: error.message });
  }
};
