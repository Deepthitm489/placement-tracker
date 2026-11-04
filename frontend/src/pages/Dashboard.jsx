import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Send,
  Clock,
  Video,
  Award,
  XCircle,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dashboardService, applicationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setError('');
      const [statsRes, recentRes, interviewsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecent(),
        dashboardService.getInterviews(),
      ]);

      if (statsRes.data?.success) {
        setStatsData(statsRes.data);
      }
      if (recentRes.data?.success) {
        setRecentApps(recentRes.data.applications || []);
      }
      if (interviewsRes.data?.success) {
        setUpcomingInterviews(interviewsRes.data.interviews || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError('Failed to fetch dynamic placement statistics from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleSeedSample = async () => {
    try {
      setLoading(true);
      await applicationService.seedDemo();
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to load sample applications: ' + (err?.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-navy-800 rounded-xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-navy-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-navy-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-navy-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalApplications: 0,
    applied: 0,
    onlineTests: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    offerRate: 0,
    interviewRate: 0,
  };

  const statusDistribution = statsData?.statusDistribution || [];
  const monthlyApplications = statsData?.monthlyApplications || [];
  const urgentInterviews = upcomingInterviews.filter((i) => i.isUrgent);

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      border: 'border-indigo-100 dark:border-indigo-900/50',
    },
    {
      title: 'Applied',
      value: stats.applied,
      icon: Send,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-100 dark:border-blue-900/50',
    },
    {
      title: 'Online Tests',
      value: stats.onlineTests,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-100 dark:border-amber-900/50',
    },
    {
      title: 'Interviews',
      value: stats.interviews,
      icon: Video,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-100 dark:border-purple-900/50',
    },
    {
      title: 'Offers Received',
      value: stats.offers,
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-100 dark:border-rose-900/50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Placement Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time status overview of your university recruitment pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors shadow-xs"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>
          <Link
            to="/applications/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Application</span>
          </Link>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="underline font-medium hover:text-rose-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* Upcoming Interview Alert Radar Banner (Next 7 Days) */}
      {urgentInterviews.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-navy-900 text-white shadow-xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 shrink-0">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Priority Alert
                </span>
                <span className="text-xs text-purple-200 font-medium">
                  {urgentInterviews.length} {urgentInterviews.length === 1 ? 'interview' : 'interviews'} scheduled within 7 days
                </span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white mt-1">
                Next up: {urgentInterviews[0].companyName} – {urgentInterviews[0].jobRole} ({urgentInterviews[0].daysRemaining === 0 ? 'Today!' : urgentInterviews[0].daysRemaining === 1 ? 'Tomorrow' : `in ${urgentInterviews[0].daysRemaining} days`})
              </p>
            </div>
          </div>

          <Link
            to="/interviews"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-navy-900 hover:bg-slate-100 font-semibold text-xs transition-colors shadow-sm"
          >
            <span>View Interview Radar</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-4 rounded-2xl bg-white dark:bg-navy-900 border ${card.border} shadow-subtle flex flex-col justify-between transition-all hover:translate-y-[-2px]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placement Success Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Offer Conversion Rate
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.offerRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({stats.offers} offers / {stats.totalApplications} total)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interview Call Rate
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.interviewRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({stats.interviews + stats.offers} progressed)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active In Pipeline
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.totalApplications - (stats.offers + stats.rejected)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                in active consideration
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: Status Pie & Monthly Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution (Pie Chart) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Application Status Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Breakdown of all active and finalized applications
              </p>
            </div>
          </div>

          {stats.totalApplications === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-navy-700 rounded-xl">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-navy-700 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Application Data Yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Start adding your company applications or load demo sample data to view interactive charts.
              </p>
              <button
                onClick={handleSeedSample}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Sample Data
              </button>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-400">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Applications (Bar Chart) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Application Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Applications submitted over the last 6 months
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="offers"
                  name="Offers Received"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Interviews & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Upcoming Interviews */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Upcoming Interviews
                </h3>
              </div>
              <Link
                to="/interviews"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all ({upcomingInterviews.length})
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-navy-700 rounded-xl">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-navy-700 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No Upcoming Interviews
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Schedule technical or HR rounds by adding an interview date to your applications.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate('/interviews')}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/40 hover:border-brand-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {item.companyName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.daysRemaining <= 2
                            ? 'bg-rose-500 text-white'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        {item.daysRemaining === 0 ? 'Today!' : item.daysRemaining === 1 ? 'Tomorrow' : `In ${item.daysRemaining} days`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {item.jobRole}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>📅 {new Date(item.interviewDate).toLocaleDateString()}</span>
                      <span>🕒 {item.interviewTime || 'Time TBD'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800">
            <Link
              to="/applications/new"
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Schedule new interview</span>
            </Link>
          </div>
        </div>

        {/* Right Column (2 cols): Recent Applications Table */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Applications
                </h3>
              </div>
              <Link
                to="/applications"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all ({stats.totalApplications})
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-navy-700 rounded-xl">
                <Briefcase className="w-9 h-9 text-slate-300 dark:text-navy-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No applications added yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Click 'Add Application' to record your first job opportunity or explore with sample data.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    to="/applications/new"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Application
                  </Link>
                  <button
                    onClick={handleSeedSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Load Sample Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-navy-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      <th className="pb-3 font-semibold">Company & Role</th>
                      <th className="pb-3 font-semibold hidden sm:table-cell">Applied Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
                    {recentApps.map((app) => (
                      <tr
                        key={app._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors"
                      >
                        <td className="py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {app.companyName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {app.jobRole}
                          </div>
                        </td>
                        <td className="py-3 hidden sm:table-cell text-xs text-slate-500 dark:text-slate-400">
                          {new Date(app.dateApplied || app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={app.status} size="xs" />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigate(`/applications/edit/${app._id}`)}
                            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                          >
                            <span>Edit</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex justify-end">
            <Link
              to="/applications"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Manage all application records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
