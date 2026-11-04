import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      setSubmitting(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(
        err?.response?.data?.message || err.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950">
      {/* Left Column: Visual Brand Pitch */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white shadow-glow">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Placement Tracker</h2>
              <p className="text-xs text-brand-300 font-medium">Your Career Journey, Organized</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-200 text-xs font-semibold">
            🎓 Campus Recruitment 2026 Edition
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Track applications, ace interviews, and secure your dream offer.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Eliminate chaotic spreadsheets. Manage your end-to-end recruitment pipeline with automated upcoming interview alerts, conversion analytics, and real-time status tracking.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-300 mt-1">Student Record Privacy</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <p className="text-2xl font-bold text-brand-300">&lt; 7 Days</p>
              <p className="text-xs text-slate-300 mt-1">Smart Interview Radar</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between">
          <span>Built for university graduates entering the professional world.</span>
          <Link to="/" className="text-brand-300 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Student Sign In
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access your placement dashboard.
            </p>
          </div>

          {/* Session Expired Banner */}
          {isExpired && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your previous session has expired. Please sign in again.</span>
            </div>
          )}

          {/* Error Alert */}
          {serverError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                College / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="student@college.edu"
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-md shadow-brand-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sign Up Link */}
          <div className="space-y-3 pt-2 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Create Free Account
              </Link>
            </p>
            <p>
              <Link to="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ← Return to Landing Page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
