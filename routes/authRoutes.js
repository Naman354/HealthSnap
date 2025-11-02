import express from "express";
import {register, login, deleteUser} from "../controllers/authController.js";
import { forgotPassword, resetPassword, verifyEmail } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.delete("/delete", protect, deleteUser);

export default router;