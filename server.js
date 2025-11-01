import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import morgan from "morgan";
import helmet from "helmet";
import profileRoutes from "./routes/profileRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";

dotenv.config();
connectDB();

const app=express();
console.log("Loaded SendGrid Key:", process.env.SENDGRID_API_KEY ? "✅ Found" : "❌ Missing");
console.log("🔑 API Key Prefix:", process.env.SENDGRID_API_KEY?.slice(0, 10));

app.use(helmet());
app.use(express.json());
app.use(morgan("dev")); 
app.disable("x-powered-by");
app.use("/api/auth", authRoutes);
app.use("/api/", profileRoutes);
app.use("/api/ml", mlRoutes);


app.get("/", (req, res) => {
    res.send("Server is Live"); 
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});