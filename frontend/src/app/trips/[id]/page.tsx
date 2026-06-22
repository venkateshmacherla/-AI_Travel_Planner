'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/axios';

type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

type Trip = {
  _id: string;
  destination: string;
  durationDays: number;
  budgetTier: string;
  interests: string[];
  generatedPlan: {
    tripSummary: string;
    itinerary: ItineraryDay[];
    budgetEstimate: Record<string, string>;
    travelTips: string[];

    hotelSuggestions: {
      name: string;
      type: string;
      description: string;
    }[];
  };
};

export default function TripDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const [newActivity, setNewActivity] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const response = await api.get(`/itineraries/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error('Failed to fetch trip', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadTrip = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      await fetchTrip();
    };

    loadTrip();
  }, [fetchTrip, id]);

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/itineraries/${trip?._id}`);

      alert('Trip deleted successfully');

      router.push('/dashboard');
    } catch (error) {
      console.error('Delete Trip Error:', error);
    }
  };

  const handleAddActivity = async (dayNumber: number) => {
    if (!newActivity.trim()) return;

    try {
      await api.put(`/itineraries/${trip?._id}/add-activity`, {
        day: dayNumber,
        activity: newActivity,
      });

      setNewActivity('');
      fetchTrip();
    } catch (error) {
      console.error('Add Activity Error:', error);
    }
  };

  const handleRemoveActivity = async (dayNumber: number, activity: string) => {
    try {
      await api.put(`/itineraries/${trip?._id}/remove-activity`, {
        day: dayNumber,
        activity,
      });

      fetchTrip();
    } catch (error) {
      console.error('Remove Activity Error:', error);
    }
  };

  const handleRegenerateDay = async (dayNumber: number) => {
    try {
      await api.put(`/itineraries/${trip?._id}/regenerate-day`, {
        day: dayNumber,
      });

      fetchTrip();
    } catch (error) {
      console.error('Regenerate Day Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950">
        <p className="text-xl text-white">Loading Trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950">
        <p className="text-xl text-red-400">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 sm:w-auto"
          >
            ← Back to Dashboard
          </button>

          <button
            onClick={handleDeleteTrip}
            className="w-full cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500 sm:w-auto"
          >
            Delete Trip
          </button>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-md sm:p-8">
          <h1 className="mb-3 text-2xl font-bold wrap-break-word text-white sm:text-4xl">
            {trip.destination}
          </h1>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
              {trip.durationDays} Days
            </span>

            <span className="rounded-full bg-green-600 px-4 py-2 text-sm text-white">
              {trip.budgetTier} Budget
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-xl sm:p-8">
          <h2 className="mb-4 text-3xl font-bold">Trip Summary</h2>

          <p className="mb-8 text-slate-700">
            {trip.generatedPlan.tripSummary}
          </p>

          <h2 className="mb-4 text-3xl font-bold">Itinerary</h2>

          {trip.generatedPlan.itinerary.map((day) => (
            <div key={day.day} className="mb-5 rounded-2xl border p-5">
              <h3 className="text-xl font-bold">Day {day.day}</h3>

              <p className="mb-3 font-medium text-slate-600">{day.title}</p>

              <ul className="space-y-2">
                {day.activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex flex-col gap-2 rounded-lg bg-slate-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm wrap-break-word sm:text-base">
                      {String(activity)}
                    </span>

                    <button
                      onClick={() => handleRemoveActivity(day.day, activity)}
                      className="cursor-pointer text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  placeholder="Add new activity"
                  value={selectedDay === day.day ? newActivity : ''}
                  onChange={(e) => {
                    setSelectedDay(day.day);
                    setNewActivity(e.target.value);
                  }}
                  className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <button
                  onClick={() => handleAddActivity(day.day)}
                  className="w-full cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 sm:w-auto"
                >
                  Add
                </button>
              </div>

              <button
                onClick={() => handleRegenerateDay(day.day)}
                className="mt-3 w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto"
              >
                🔄 Regenerate Day
              </button>
            </div>
          ))}

          <h2 className="mt-10 mb-4 text-3xl font-bold">Recommended Hotels</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trip.generatedPlan.hotelSuggestions?.map((hotel, index) => (
              <div key={index} className="rounded-2xl border p-4 shadow-md">
                <h3 className="text-lg font-bold wrap-break-word sm:text-xl">
                  🏨 {hotel.name}
                </h3>

                <p className="font-medium text-blue-600">{hotel.type}</p>

                <p className="mt-2 text-slate-600">{hotel.description}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-8 mb-4 text-3xl font-bold">Budget Estimate</h2>

          <div className="space-y-4">
            {Object.entries(trip.generatedPlan.budgetEstimate).map(
              ([key, value]) => (
                <div key={key} className="border-b pb-4">
                  <p className="text-lg font-semibold capitalize">{key}</p>

                  <p className="mt-1 wrap-break-word text-slate-600">{value}</p>
                </div>
              ),
            )}
          </div>
          <h2 className="mt-10 mb-4 text-3xl font-bold">Travel Tips</h2>

          <ul className="space-y-3">
            {trip.generatedPlan.travelTips?.map((tip, index) => (
              <li key={index} className="rounded-xl bg-slate-100 p-4 shadow-sm">
                <span className="font-semibold text-blue-600">
                  Tip {index + 1}
                </span>

                <p className="mt-2 text-sm wrap-break-word text-slate-700 sm:text-base">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
