'use client';

import { useState } from 'react';
import api from '../../lib/axios';
import Link from 'next/link';

type ItineraryDay = {
  day: number;
  title: string;
  activities: string[];
};

type TripData = {
  tripSummary: string;
  itinerary: ItineraryDay[];
  budgetEstimate: Record<string, string>;
};

export default function CreateTripPage() {
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [budgetTier, setBudgetTier] = useState('Medium');
  const [interests, setInterests] = useState('');

  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerateTrip = async () => {
    if (!destination.trim()) {
      setError('Destination is required');
      return;
    }

    if (!interests.trim()) {
      setError('Please enter at least one interest');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setTripData(null);

      const response = await api.post('/ai/generate-itinerary', {
        destination,
        durationDays,
        budgetTier,
        interests: interests.split(',').map((item) => item.trim()),
      });

      const aiResponse = response.data.data;

      await api.post('/itineraries', {
        destination,
        durationDays,
        budgetTier,
        interests: interests.split(',').map((item) => item.trim()),
        generatedPlan: aiResponse,
      });

      setTripData(aiResponse);

      setSuccess('Trip generated and saved successfully!');
    } catch (err) {
      console.error(err);

      setError('Unable to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-6">
      <div className="mx-auto max-w-5xl">
        <Link href={'/dashboard'}>
          <h1 className="mb-2 text-4xl font-bold text-white">
            Create New Trip
          </h1>

          <p className="mb-8 text-slate-400">
            Let AI build your personalized travel itinerary.
          </p>
        </Link>

        {/* Form Card */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="destination" className="mb-2 block text-white">
                Destination
              </label>

              <input
                id="destination"
                type="text"
                placeholder="Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl bg-white px-4 py-3 text-black"
              />
            </div>

            <div>
              <label htmlFor="days" className="mb-2 block text-white">
                Number of Days
              </label>

              <input
                id="days"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full rounded-xl bg-white px-4 py-3 text-black"
              />
            </div>

            <div>
              <label htmlFor="budget" className="mb-2 block text-white">
                Budget
              </label>

              <select
                id="budget"
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full rounded-xl bg-white px-4 py-3 text-black"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="interests" className="mb-2 block text-white">
                Interests
              </label>

              <input
                id="interests"
                type="text"
                placeholder="Anime, Food, Culture"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full rounded-xl bg-white px-4 py-3 text-black"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-xl bg-green-100 p-3 text-green-700">
              {success}
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerateTrip}
            disabled={loading}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Your Travel Plan...' : 'Generate Trip'}
          </button>
        </div>

        {/* Generated Result */}
        {tripData && (
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">✈️ Trip Summary</h2>

            <p className="mb-8 text-slate-700">{tripData.tripSummary}</p>

            <h2 className="mb-4 text-3xl font-bold">🗓️ Itinerary</h2>

            {tripData.itinerary.map((day) => (
              <div key={day.day} className="mb-6 rounded-xl border p-5">
                <h3 className="text-xl font-bold">Day {day.day}</h3>

                <p className="mb-2 font-medium text-slate-700">{day.title}</p>

                <ul className="list-disc space-y-1 pl-5">
                  {day.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h2 className="mt-8 mb-4 text-3xl font-bold">💰 Budget Estimate</h2>

            <div className="space-y-4 rounded-xl bg-slate-100 p-5">
              {Object.entries(tripData.budgetEstimate).map(([key, value]) => (
                <div
                  key={key}
                  className="border-b border-slate-300 pb-3 last:border-none"
                >
                  <h3 className="text-lg font-bold text-slate-900 capitalize">
                    {key}
                  </h3>

                  <p className="mt-1 leading-relaxed text-slate-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
