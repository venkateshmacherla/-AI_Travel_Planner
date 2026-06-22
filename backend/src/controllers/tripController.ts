import { Response } from "express";

import Trip from "../models/Trip";

import { AuthRequest } from "../types";

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;

    const trip = await Trip.create({
      userId: req.user?.id,

      destination,
      durationDays,
      budgetTier,
      interests,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Trip Creation Failed",
    });
  }
};

export const getTrips = async (req: AuthRequest, res: Response) => {
  try {
    const trips = await Trip.find({
      userId: req.user?.id,
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable To Fetch Trips",
    });
  }
};
