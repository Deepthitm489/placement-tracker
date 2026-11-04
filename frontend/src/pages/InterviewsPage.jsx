import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  Video,
  ExternalLink,
  Edit3,
  AlertCircle,
  Building2,
  Calendar,
  Globe,
  MapPin,
  FileText,
  History,
  CheckCircle2,
} from 'lucide-react';
import { dashboardService, applicationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const InterviewsPage = () => {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'urgent' | 'past'

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');

      const [upcomingRes, allAppsRes] = await Promise.all([
        dashboardService.getInterviews(),
        applicationService.getAll({ sortBy: 'interview_date', limit: 100 }),
      ]);

      if (upcomingRes.data?.success) {
        setUpcoming(upcomingRes.data.interviews || []);
      }

      if (allAppsRes.data?.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find past interviews (interviewDate defined and < today)
        const pastList = (allAppsRes.data.applications || []).filter(
          (app) => app.interviewDate && new Date(app.interviewDate) < today
        );
        setPast(pastList);
      }
    } catch (err) {
      setError('Failed to fetch interview schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const urgentCount = upcoming.filter((i) => i.isUrgent).length;

  const currentDisplayList =
    tab === 'urgent'
      ? upcoming.filter((i) => i.isUrgent)
      : tab === 'past'
      ? past
      : upcoming;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Management & Radar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track interview dates, countdowns, technical formats, and preparation notes.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'upcoming'
                ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setTab('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'urgent'
                ? 'bg-white dark:bg-navy-800 text-purple-600 dark:text-purple-400 shadow-2xs'
                : 'text-purple-700 dark:text-purple-300 hover:text-purple-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Next 7 Days ({urgentCount})</span>
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'past'
                ? 'bg-white dark:bg-navy-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Past Rounds ({past.length})
          </button>
        </div>
      </div>

      {/* 7-Day Urgent Warning Banner */}
      {urgentCount > 0 && tab !== 'past' && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs">
            <span className="font-bold">Interview Alert:</span> You have{' '}
            <strong className="underline">{urgentCount} interview{urgentCount > 1 ? 's' : ''}</strong> scheduled in the next 7 days. Review the attached preparation notes, data structure patterns, and company questions.
          </p>
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500">
            Scanning interview schedule...
          </p>
        </div>
      ) : currentDisplayList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-dashed border-slate-300 dark:border-navy-800">
          <CalendarDays className="w-12 h-12 text-slate-300 dark:text-navy-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {tab === 'urgent'
              ? 'No Interviews Within 7 Days'
              : tab === 'past'
              ? 'No Past Interviews Recorded'
              : 'No Upcoming Interviews Scheduled'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {tab === 'past'
              ? 'Completed and concluded interview rounds will appear here automatically.'
              : 'Add upcoming interview dates to your company applications to activate countdown radar alerts.'}
          </p>
          <div className="mt-5">
            <Link
              to="/applications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md"
            >
              Go to Applications List
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDisplayList.map((item) => {
            const isToday = item.daysRemaining === 0;
            const isTomorrow = item.daysRemaining === 1;

            return (
              <div
                key={item._id}
                className={`p-6 rounded-3xl bg-white dark:bg-navy-900 border transition-all shadow-subtle flex flex-col justify-between ${
                  item.isUrgent && tab !== 'past'
                    ? 'border-purple-300 dark:border-purple-800 ring-1 ring-purple-400/20'
                    : 'border-slate-200 dark:border-navy-800'
                }`}
              >
                <div>
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <Link
                          to={`/applications/${item._id}`}
                          className="font-bold text-slate-900 dark:text-white text-base hover:text-brand-600 dark:hover:text-brand-400 block transition-colors"
                        >
                          {item.companyName}
                        </Link>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.jobRole}
                        </p>
                      </div>
                    </div>

                    {tab !== 'past' ? (
                      <span
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                          isToday
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isTomorrow
                            ? 'bg-amber-500 text-white'
                            : item.daysRemaining <= 7
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                        }`}
                      >
                        {isToday ? '🔥 Today!' : isTomorrow ? '⚡ Tomorrow' : `In ${item.daysRemaining} days`}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-navy-800 px-2.5 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Timing & Logistics */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        Interview Date:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {new Date(item.interviewDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        Scheduled Time:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.interviewTime || 'Time TBD'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Video className="w-3.5 h-3.5 text-purple-600" />
                        Format / Venue:
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.interviewType || item.location || 'Online'}
                      </span>
                    </div>
                  </div>

                  {/* Prep Notes */}
                  {item.notes && (
                    <div className="mt-3 p-3 rounded-2xl bg-purple-50/40 dark:bg-navy-800/40 border border-purple-100/50 dark:border-navy-700 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-bold text-purple-700 dark:text-purple-300 text-[11px] mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Technical Notes:
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
                  <StatusBadge status={item.status} size="xs" />

                  <div className="flex items-center gap-2">
                    {item.companyWebsite && (
                      <a
                        href={item.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-brand-600"
                        title="Company Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {item.applicationLink && (
                      <a
                        href={item.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-brand-600"
                        title="Application Portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      to={`/applications/${item._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:underline px-2 py-1 rounded-xl"
                    >
                      <span>Details</span>
                    </Link>
                    <button
                      onClick={() => navigate(`/applications/edit/${item._id}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1 rounded-xl hover:bg-brand-50"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Round</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewsPage;
