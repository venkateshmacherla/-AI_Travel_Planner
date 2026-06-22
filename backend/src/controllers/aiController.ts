import { Request, Response } from "express";
import { generateItinerary } from "../services/geminiService";

export const generateTripPlan = async (req: Request, res: Response) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;

    const itinerary = await generateItinerary(
      destination,
      durationDays,
      budgetTier,
      interests,
    );

    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate itinerary",
    });
  }
};
