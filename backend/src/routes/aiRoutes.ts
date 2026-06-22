import express from "express";

import protect from "../middleware/authMiddleware";

import { generateTripPlan } from "../controllers/aiController";

const router = express.Router();

router.post("/generate-itinerary", protect, generateTripPlan);

export default router;
