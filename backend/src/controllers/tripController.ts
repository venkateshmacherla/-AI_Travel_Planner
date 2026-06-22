import { Request, Response } from "express";

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

export const toggleFavoriteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    trip.isFavorite = !trip.isFavorite;

    await trip.save();

    return res.status(200).json(trip);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to update favorite status",
    });
  }
};
