import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import tripRoutes from "./routes/tripRoutes";
import aiRoutes from "./routes/aiRoutes";

import itineraryRoutes from "./routes/itineraryRoutes";

console.log("Gemini ENV:", !!process.env.GEMINI_API_KEY);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("AI Travel Planner API");
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api/itineraries", itineraryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
