import express from "express";

import protect from "../middleware/authMiddleware";

import {
  createTrip,
  getTrips,
  toggleFavoriteTrip,
} from "../controllers/tripController";

const router = express.Router();

router.post("/", protect, createTrip);

router.get("/", protect, getTrips);

router.put("/:id/favorite", protect, toggleFavoriteTrip);

export default router;
