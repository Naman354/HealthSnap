import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app=express();

app.use(express.json());

app.use(".api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server is Live"); 
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});