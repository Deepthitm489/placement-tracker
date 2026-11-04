import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950 p-6">
      <div className="max-w-md w-full text-center space-y-5 bg-white dark:bg-navy-900 p-8 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">
            Page Not Found
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            The page you requested does not exist or may have been moved.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
