import { Response } from "express";

import Itinerary from "../models/Itinerary";
import { AuthRequest } from "../types";

import {
  generateItinerary,
  regenerateDayPlan,
} from "../services/geminiService";

export const saveItinerary = async (req: AuthRequest, res: Response) => {
  try {
    const { destination, durationDays, budgetTier, interests, generatedPlan } =
      req.body;

    const itinerary = await Itinerary.create({
      userId: req.user?.id,

      destination,
      durationDays,
      budgetTier,
      interests,

      generatedPlan,
    });

    res.status(201).json(itinerary);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to Save Itinerary",
    });
  }
};

export const getUserItineraries = async (req: AuthRequest, res: Response) => {
  try {
    const itineraries = await Itinerary.find({
      userId: req.user?.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(itineraries);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to Fetch Itineraries",
    });
  }
};

export const addActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { day, activity } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: id,
      userId: req.user?.id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary Not Found",
      });
    }

    if (!itinerary.generatedPlan || !itinerary.generatedPlan.itinerary) {
      return res.status(400).json({
        message: "Invalid itinerary structure",
      });
    }

    const selectedDay = itinerary.generatedPlan.itinerary.find(
      (item: any) => item.day === day,
    );

    if (!selectedDay) {
      return res.status(404).json({
        message: "Day Not Found",
      });
    }

    if (!selectedDay.activities) {
      selectedDay.activities = [];
    }

    selectedDay.activities.push(activity);

    itinerary.markModified("generatedPlan");

    await itinerary.save();

    res.status(200).json({
      success: true,
      message: "Activity Added Successfully",
      data: itinerary,
    });
  } catch (error: any) {
    console.error("ADD ACTIVITY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { day, activity } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: id,
      userId: req.user?.id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary Not Found",
      });
    }

    if (!itinerary.generatedPlan || !itinerary.generatedPlan.itinerary) {
      return res.status(400).json({
        message: "Invalid itinerary structure",
      });
    }

    const selectedDay = itinerary.generatedPlan.itinerary.find(
      (item: any) => item.day === day,
    );

    if (!selectedDay) {
      return res.status(404).json({
        message: "Day Not Found",
      });
    }

    selectedDay.activities = selectedDay.activities.filter(
      (item: string) => item !== activity,
    );

    itinerary.markModified("generatedPlan");

    await itinerary.save();

    res.status(200).json({
      success: true,
      message: "Activity Removed Successfully",
      data: itinerary,
    });
  } catch (error: any) {
    console.error("REMOVE ACTIVITY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const regenerateDay = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { day } = req.body;

    const itinerary = await Itinerary.findOne({
      _id: id,
      userId: req.user?.id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary Not Found",
      });
    }

    const selectedDay = itinerary.generatedPlan.itinerary.find(
      (item: any) => item.day === day,
    );

    if (!selectedDay) {
      return res.status(404).json({
        message: "Day Not Found",
      });
    }

    const regeneratedDay = await regenerateDayPlan(
      itinerary.destination,
      itinerary.budgetTier,
      itinerary.interests,
      day,
    );

    selectedDay.title = regeneratedDay.title;

    selectedDay.activities = regeneratedDay.activities;

    itinerary.markModified("generatedPlan");

    await itinerary.save();

    res.status(200).json({
      success: true,
      message: "Day regenerated successfully",
      data: itinerary,
    });
  } catch (error: any) {
    console.error("REGENERATE DAY ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getItineraryById = async (req: AuthRequest, res: Response) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    res.json(itinerary);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteItinerary = async (req: AuthRequest, res: Response) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!itinerary) {
      return res.status(404).json({
        message: "Itinerary not found",
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete trip",
    });
  }
};
