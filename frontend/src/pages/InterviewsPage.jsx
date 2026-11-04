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
  CheckCircle2,
  Sparkles,
  MapPin,
  FileText,
} from 'lucide-react';
import { dashboardService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const InterviewsPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'urgent' (next 7 days)

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardService.getInterviews();
      if (res.data?.success) {
        setInterviews(res.data.interviews || []);
      }
    } catch (err) {
      setError('Failed to fetch upcoming interview schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const urgentCount = interviews.filter((i) => i.isUrgent).length;
  const filteredList = filter === 'urgent' ? interviews.filter((i) => i.isUrgent) : interviews;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interview Schedule & Reminders
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track interview dates, meeting links, and prep notes for upcoming rounds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            All Upcoming ({interviews.length})
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filter === 'urgent'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Next 7 Days ({urgentCount})</span>
          </button>
        </div>
      </div>

      {/* Urgent Warning Banner */}
      {urgentCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-xs sm:text-sm">
            <span className="font-bold">Heads up:</span> You have{' '}
            <span className="font-bold underline">{urgentCount} interview{urgentCount > 1 ? 's' : ''}</span> scheduled within the next 7 days. Be sure to review your algorithms, resume projects, and questions for the interviewer.
          </p>
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Scanning for upcoming interviews...
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-300 dark:border-navy-800">
          <CalendarDays className="w-12 h-12 text-slate-300 dark:text-navy-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {filter === 'urgent' ? 'No Interviews Within 7 Days' : 'No Upcoming Interviews Scheduled'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {filter === 'urgent'
              ? 'None of your interviews fall in the 7-day radar window. Keep checking back or view all upcoming interviews.'
              : 'Add interview dates and times to your applications to turn on automated reminders.'}
          </p>
          <div className="mt-5">
            <Link
              to="/applications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
            >
              Go to Applications List
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const isToday = item.daysRemaining === 0;
            const isTomorrow = item.daysRemaining === 1;

            return (
              <div
                key={item._id}
                className={`p-6 rounded-2xl bg-white dark:bg-navy-900 border transition-all shadow-subtle flex flex-col justify-between ${
                  item.isUrgent
                    ? 'border-purple-300 dark:border-purple-800/80 ring-1 ring-purple-400/20'
                    : 'border-slate-200 dark:border-navy-800'
                }`}
              >
                <div>
                  {/* Top Row: Company & Urgency Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {item.companyName}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.jobRole}
                        </p>
                      </div>
                    </div>

                    {/* Countdown Badge */}
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        isToday
                          ? 'bg-rose-500 text-white animate-pulse'
                          : isTomorrow
                          ? 'bg-amber-500 text-white'
                          : item.daysRemaining <= 7
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
                      }`}
                    >
                      {isToday ? '🔥 Today!' : isTomorrow ? '⚡ Tomorrow' : `In ${item.daysRemaining} days`}
                    </span>
                  </div>

                  {/* Timing & Venue */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-100 dark:border-navy-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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
                        <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        Scheduled Time:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.interviewTime || 'Time TBD'}
                      </span>
                    </div>

                    {item.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          Location / Mode:
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Prep Notes */}
                  {item.notes && (
                    <div className="mt-3 p-3 rounded-xl bg-purple-50/40 dark:bg-navy-800/40 border border-purple-100/50 dark:border-navy-700 text-xs text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-purple-700 dark:text-purple-300 text-[11px] mb-1 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Preparation Notes:
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{item.notes}</p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
                  <StatusBadge status={item.status} size="xs" />

                  <div className="flex items-center gap-2">
                    {item.applicationLink && (
                      <a
                        href={item.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        title="Open career portal"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`/applications/edit/${item._id}`)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/40"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Interview</span>
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
