/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../lib/axios';

type Itinerary = {
  _id: string;
  destination: string;
  durationDays: number;
  budgetTier: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await api.get('/itineraries');
        setItineraries(response.data);
      } catch (error) {
        console.error('Failed to fetch itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUsername(parsedUser.name || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950">
      {/* Navbar */}
      <nav className="border-b border-slate-800 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link href={'/dashboard'}>
              <h1 className="text-2xl font-bold text-white">
                AI Travel Planner
              </h1>

              <p className="text-sm text-slate-400">Plan smarter with AI</p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <h2 className="text-1xl font-bold text-white">
                Welcome: {username}
              </h2>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white">Welcome Back 👋</h2>

          <p className="mt-2 text-slate-400">
            Generate personalized travel itineraries powered by AI.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="text-sm text-slate-300">Total Trips</h3>

            <p className="mt-3 text-4xl font-bold text-white">
              {itineraries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="text-sm text-slate-300">Saved Itineraries</h3>

            <p className="mt-3 text-4xl font-bold text-white">
              {itineraries.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h3 className="text-sm text-slate-300">AI Generated Trips</h3>

            <p className="mt-3 text-4xl font-bold text-white">
              {itineraries.length}
            </p>
          </div>
        </div>

        {/* Create Trip Card */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
          <h3 className="mb-3 text-2xl font-bold text-white">
            Ready for your next adventure?
          </h3>

          <p className="mb-6 text-slate-300">
            Let AI generate a complete travel itinerary based on your
            destination, budget, and interests.
          </p>

          <button
            onClick={() => router.push('/create-trip')}
            className="cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Create New Trip
          </button>
        </div>

        {/* Recent Trips */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Recent Trips</h3>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-slate-400">Loading trips...</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400">No trips created yet.</p>

              <p className="mt-2 text-sm text-slate-500">
                Click &quot;Create New Trip&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {itineraries.map((trip) => (
                <Link href={`/trips/${trip._id}`} key={trip._id}>
                  <div className="bg-white/5border cursor-pointer rounded-xl border-white/10 p-5 transition-all hover:border-blue-500/50 hover:bg-white/10">
                    <h4 className="text-lg font-semibold text-white">
                      {trip.destination}
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      {trip.durationDays} Days • {trip.budgetTier} Budget
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
