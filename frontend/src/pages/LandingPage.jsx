import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Briefcase,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  Send,
  Download,
  Users,
  Building2,
  FileSpreadsheet,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePWA } from '../hooks/usePWA';
import InstallAppModal from '../components/InstallAppModal';
import StatusBadge from '../components/StatusBadge';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, isIOS, installApp } = usePWA();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const handleInstallClick = () => {
    if (isInstallable && !isIOS) {
      installApp();
    } else {
      setShowInstallModal(true);
    }
  };

  const faqs = [
    {
      q: 'Is Placement Tracker completely free for university students?',
      a: 'Yes! Placement Tracker is 100% free for all undergraduate and graduate students. There are no hidden fees or tier limits—you can record unlimited job applications, interview timelines, and salary offers.',
    },
    {
      q: 'Can other students or college administrators see my private applications?',
      a: 'Never. Data protection and student privacy are core architectural tenets. Every application record is encrypted and cryptographically bound to your individual student account. No other user can ever view your records.',
    },
    {
      q: 'How does the Progressive Web App (PWA) installation work on mobile?',
      a: 'On Android, clicking "Install App" triggers the native Android installation prompt. On iPhones, tap Safari’s Share button and select "Add to Home Screen". Placement Tracker will launch in a clean, standalone window without browser address bars.',
    },
    {
      q: 'How does the 7-Day Interview Radar work?',
      a: 'Whenever you add an interview date to a company application, our system continuously monitors the days remaining. Interviews scheduled within the next 7 days are automatically highlighted with urgent countdown badges.',
    },
    {
      q: 'Can I export my placement records for resume reviews or college reports?',
      a: 'Yes! You can instantly export all filtered applications to an Excel-compatible CSV spreadsheet or open the printable dossier modal to generate clean PDF reports.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-glow">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Placement Tracker
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
                2026 Edition
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dashboard Preview</a>
            <a href="#benefits" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Student Benefits</a>
            <a href="#faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Install App Button */}
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30 transition-all"
                >
                  <span>Get Started Free</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-purple-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Placement Tracker • Your Career Journey, Organized</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto">
            Organize campus applications, master interviews, and{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-500">
              secure dream job offers.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate chaotic spreadsheets. Manage your end-to-end university recruitment pipeline with automated 7-day interview countdowns, 7 distinct progress stages, and real-time MongoDB analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all hover:translate-y-[-2px] cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-800 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-navy-700 shadow-sm transition-all"
            >
              <span>Student Sign In</span>
            </Link>
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-sm border border-purple-200 dark:border-purple-800 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install Mobile PWA</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Installable on Android & iPhone</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Student Record Privacy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Dynamic MongoDB Atlas Backend</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dashboard Interactive Preview Showcase */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white/70 dark:bg-navy-900/70 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-400 ml-2">placement-tracker-demo.app</span>
            </div>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
              Live Mockup Preview
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-100 dark:border-navy-800">
              <span className="text-[11px] text-slate-500">Total Applications</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">24</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <span className="text-[11px] text-blue-600 dark:text-blue-300">Active Rounds</span>
              <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-200 mt-1">11</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <span className="text-[11px] text-purple-600 dark:text-purple-300">Interviews</span>
              <p className="text-2xl font-extrabold text-purple-700 dark:text-purple-200 mt-1">6</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-300">Offers Received</span>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-200 mt-1">3</p>
            </div>
          </div>

          {/* Sample Table Row Mockup */}
          <div className="rounded-2xl border border-slate-100 dark:border-navy-800 overflow-hidden text-xs">
            <div className="p-3 bg-slate-100/70 dark:bg-navy-950/70 font-bold uppercase tracking-wider text-slate-500 flex justify-between">
              <span>Company & Position</span>
              <span>Stage Status</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-navy-800 bg-white dark:bg-navy-900">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white">Google</strong>
                  <span className="text-slate-500 ml-2">Software Engineer • ₹32 LPA</span>
                </div>
                <StatusBadge status="Technical Interview" size="xs" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white">Microsoft</strong>
                  <span className="text-slate-500 ml-2">SDE-1 • ₹28 LPA</span>
                </div>
                <StatusBadge status="Offer" size="xs" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 dark:text-white">Amazon</strong>
                  <span className="text-slate-500 ml-2">Graduate SDE • ₹26 LPA</span>
                </div>
                <StatusBadge status="Online Test" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Application Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-navy-900 border-y border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400">
              Powerful Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything students need to navigate recruitment season.
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Designed from the ground up for university placement departments, campus drives, and off-campus tech applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-brand-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Send className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                7-Stage Recruitment Tracker
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Track status across Applied, Online Test, Technical Interview, HR Interview, Offer, Rejected, and On Hold with automated timeline history.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-purple-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                7-Day Interview Radar
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Smart countdown badges highlight upcoming technical, behavioral, and video rounds happening within 7 days so you never miss an interview.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Dynamic Recharts Analytics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive Pie distribution and Monthly application volume charts computed live from your MongoDB records with offer conversion rates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-amber-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Installable Progressive Web App
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Install as a native application on Android, iPhone, Windows, or Mac. Features offline application shell and network connection detection.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-indigo-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Excel CSV & Print Dossier
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export all company applications to formatted Excel spreadsheets or launch the print modal for beautiful PDF dossiers of any interview.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-3 hover:border-brand-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Private & Secure Architecture
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Passwords encrypted with bcrypt, JWT authorization tokens, and complete isolation ensuring you only ever access your own records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400">
            Simple 4-Step Process
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Placement Tracker Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold mx-auto shadow-md">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Create Student Account</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign up with your university details, degree, department, and graduation year in seconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-extrabold mx-auto shadow-md">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Record Opportunities</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add company applications with CTC package, job descriptions, test links, and portal URLs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold mx-auto shadow-md">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Ace Interview Rounds</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Schedule technical and HR rounds. Stay alert with 7-day countdown reminders and preparation notes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center space-y-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold mx-auto shadow-md">
              4
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Celebrate Offers</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Compare salary offers, celebrate milestones, and analyze your placement conversion ratios.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Benefits for Students */}
      <section id="benefits" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
                Student Superpowers
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Never lose an opportunity to bad organization again.
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                During placement season, students typically manage 20 to 50 concurrent company processes. Missing an online test deadline or showing up unprepared for a technical round can cost an offer.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong>Zero Missed Interviews:</strong> Automated 7-day countdown banners and notification radar keep upcoming meetings top of mind.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong>Algorithm & Concept Prep Notes:</strong> Keep company-specific notes (Dynamic Programming, System Design, behavioral cues) attached to each application.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200">
                    <strong>Instant Status Switcher:</strong> Move applications between Technical, HR, and Offer status in a single click.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg transition-all"
                >
                  <span>Start Tracking Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-6">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Placement Success Ratio</span>
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Interview Progression Rate</span>
                    <span className="text-purple-400 font-bold">58%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-[58%] h-full bg-purple-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Final Offer Conversion</span>
                    <span className="text-emerald-400 font-bold">25%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="w-[25%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400">
            Frequently Asked Questions
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Got Questions? We’ve Got Answers.
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === index ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-navy-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 dark:text-white">Placement Tracker</span>
            <span>• Your Career Journey, Organized.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-brand-600">Student Sign In</Link>
            <Link to="/register" className="hover:text-brand-600">Register</Link>
            <button onClick={handleInstallClick} className="hover:text-purple-600">Install PWA</button>
          </div>

          <div>
            © {new Date().getFullYear()} Placement Tracker System. Built for university graduates.
          </div>
        </div>
      </footer>

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={installApp}
        isIOS={isIOS}
        isInstallable={isInstallable}
      />
    </div>
  );
};

export default LandingPage;
