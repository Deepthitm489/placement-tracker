import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Send,
  Clock,
  Video,
  UserCheck,
  Award,
  XCircle,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Printer,
  PauseCircle,
  Layers,
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

  const handlePrintSummary = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-navy-800 rounded-2xl w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-navy-800 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-navy-800 rounded-3xl" />
          <div className="h-80 bg-slate-200 dark:bg-navy-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {
    totalApplications: 0,
    activeApplications: 0,
    applied: 0,
    onlineTests: 0,
    technicalInterviews: 0,
    hrInterviews: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
    onHold: 0,
    offerRate: 0,
    interviewRate: 0,
  };

  const statusDistribution = statsData?.statusDistribution || [];
  const monthlyApplications = statsData?.monthlyApplications || [];
  const urgentInterviews = upcomingInterviews.filter((i) => i.isUrgent);

  const statCards = [
    {
      title: 'Total Applied',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      title: 'Screening',
      value: stats.applied,
      icon: Send,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      title: 'Online Tests',
      value: stats.onlineTests,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
    },
    {
      title: 'Tech Rounds',
      value: stats.technicalInterviews,
      icon: Video,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/50',
    },
    {
      title: 'HR Rounds',
      value: stats.hrInterviews,
      icon: UserCheck,
      color: 'text-fuchsia-600 dark:text-fuchsia-400',
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/50',
    },
    {
      title: 'Offers',
      value: stats.offers,
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      title: 'On Hold',
      value: stats.onHold,
      icon: PauseCircle,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Placement Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time MongoDB recruitment pipeline metrics & analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSummary}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors shadow-2xs"
            title="Print / Save Placement Report"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors shadow-2xs"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>
          <Link
            to="/applications/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Application</span>
          </Link>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button onClick={fetchDashboardData} className="underline font-bold">
            Retry
          </button>
        </div>
      )}

      {/* 7-Day Interview Alert Radar Banner */}
      {urgentInterviews.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-navy-900 text-white shadow-xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-2xl text-purple-300 shrink-0">
              <Calendar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  7-Day Priority Radar
                </span>
                <span className="text-xs text-purple-200 font-medium">
                  {urgentInterviews.length} {urgentInterviews.length === 1 ? 'interview' : 'interviews'} scheduled within 7 days
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">
                Next: {urgentInterviews[0].companyName} – {urgentInterviews[0].jobRole} ({urgentInterviews[0].daysRemaining === 0 ? 'Today!' : urgentInterviews[0].daysRemaining === 1 ? 'Tomorrow' : `in ${urgentInterviews[0].daysRemaining} days`})
              </p>
            </div>
          </div>

          <Link
            to="/interviews"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-navy-900 hover:bg-slate-100 font-bold text-xs transition-colors shadow-sm"
          >
            <span>View Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 7 Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between transition-all hover:translate-y-[-2px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion Rate Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Offer Conversion Rate
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.offerRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({stats.offers} offers / {stats.totalApplications} total)
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Interview Call Rate
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.interviewRate}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({stats.interviews + stats.offers} advanced)
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Pipeline
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats.activeApplications}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                applications currently active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts: Status Pie & Monthly Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution (Pie Chart) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                7-Stage Status Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active pipeline distribution across all recruitment phases
              </p>
            </div>
          </div>

          {stats.totalApplications === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-navy-700 rounded-2xl">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-navy-700 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No Applications Added Yet
              </p>
              <button
                onClick={handleSeedSample}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-300"
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
                    formatter={(val) => <span className="text-[11px] text-slate-500 dark:text-slate-400">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Monthly Applications (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Application Velocity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submissions and secured job offers over the past 6 months
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
                  barSize={20}
                />
                <Bar
                  dataKey="offers"
                  name="Offers Received"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Interviews & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Upcoming Interviews */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upcoming Interviews
                </h3>
              </div>
              <Link
                to="/interviews"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                All ({upcomingInterviews.length})
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-navy-700 rounded-2xl">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-navy-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No Interviews Scheduled
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Add interview dates to your applications to activate the radar countdown.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate('/interviews')}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-800/40 hover:border-brand-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
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

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">
                      {item.jobRole} ({item.interviewType || 'Interview'})
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>📅 {new Date(item.interviewDate).toLocaleDateString()}</span>
                      <span>🕒 {item.interviewTime || 'TBD'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800">
            <Link
              to="/applications/new"
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Schedule new interview</span>
            </Link>
          </div>
        </div>

        {/* Right Column (2 cols): Recent Applications Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Applications
                </h3>
              </div>
              <Link
                to="/applications"
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                View all ({stats.totalApplications})
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-navy-700 rounded-2xl">
                <Briefcase className="w-9 h-9 text-slate-300 dark:text-navy-700 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No applications added yet
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    to="/applications/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Application
                  </Link>
                  <button
                    onClick={handleSeedSample}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Load Sample Data
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-navy-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      <th className="pb-3 font-bold">Company & Role</th>
                      <th className="pb-3 font-bold hidden sm:table-cell">Applied Date</th>
                      <th className="pb-3 font-bold">Stage Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
                    {recentApps.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                        <td className="py-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {app.companyName}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {app.jobRole}
                          </div>
                        </td>
                        <td className="py-3 hidden sm:table-cell text-xs text-slate-500">
                          {new Date(app.dateApplied || app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={app.status} size="xs" />
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigate(`/applications/edit/${app._id}`)}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
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
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
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
