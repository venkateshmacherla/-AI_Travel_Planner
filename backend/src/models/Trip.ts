import mongoose, { Document } from "mongoose";

export interface IItinerary extends Document {
  userId: mongoose.Types.ObjectId;
  destination: string;
  durationDays: number;
  budgetTier: string;
  interests: string[];
  generatedPlan: any;
  isFavorite: boolean;
}

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    budgetTier: {
      type: String,
      required: true,
    },

    interests: [
      {
        type: String,
      },
    ],

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IItinerary>("Trip", TripSchema);
