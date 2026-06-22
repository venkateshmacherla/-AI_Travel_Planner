import express from "express";

import protect from "../middleware/authMiddleware";

import { createTrip, getTrips } from "../controllers/tripController";

const router = express.Router();

router.post("/", protect, createTrip);

router.get("/", protect, getTrips);

export default router;
