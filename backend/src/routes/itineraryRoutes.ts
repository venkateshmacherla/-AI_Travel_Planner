import express from "express";

import protect from "../middleware/authMiddleware";

import {
  saveItinerary,
  getUserItineraries,
  addActivity,
  removeActivity,
  regenerateDay,
  getItineraryById,
  deleteItinerary,
  toggleFavoriteItinerary,
} from "../controllers/itineraryController";

const router = express.Router();

router.post("/", protect, saveItinerary);

router.get("/", protect, getUserItineraries);

router.put("/:id/add-activity", protect, addActivity);

router.put("/:id/remove-activity", protect, removeActivity);

router.put("/:id/regenerate-day", protect, regenerateDay);

router.get("/:id", protect, getItineraryById);

router.delete("/:id", protect, deleteItinerary);

router.put("/:id/favorite", protect, toggleFavoriteItinerary);

export default router;
