import express from "express";
import { addSymptomEntry } from "../controllers/profileController.js";
import protect from "../middlewares/authMiddleware.js";


const router=express.Router();

router.post("/profile", protect, addSymptomEntry);
export default router;