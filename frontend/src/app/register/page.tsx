'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../../services/authService';
import { useRouter } from 'next/navigation';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [success, setSuccess] = useState('');

  const { register, handleSubmit } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await registerUser(data);

      setSuccess('Registration successful! Redirecting to login...');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl bg-white/95 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm md:p-10">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="mt-3 text-slate-500">
              Plan smarter trips with AI-powered itineraries
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                {...register('name', {
                  required: 'Name is required',
                })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                {...register('email', {
                  required: 'Email is required',
                })}
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                {...register('password', {
                  required: 'Password is required',
                })}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 border-t border-slate-200 pt-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
              <button
                onClick={() => router.push('/login')}
                className="ml-1 cursor-pointer font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-2 text-center text-sm text-slate-400">
          AI Travel Planner • Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
