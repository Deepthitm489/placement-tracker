import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Video,
  Send,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { dashboardService } from '../services/api';

const AnalyticsPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getStats();
        if (res.data?.success) {
          setStatsData(res.data);
        }
      } catch (err) {
        setError('Failed to fetch analytics metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-navy-800 rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  // Funnel calculations
  const total = stats.totalApplications || 1;
  const funnelStages = [
    {
      stage: '1. Applications Sent',
      count: stats.totalApplications,
      pct: 100,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
    },
    {
      stage: '2. Online Tests (OA)',
      count: stats.onlineTests + stats.interviews + stats.offers,
      pct: Math.round(((stats.onlineTests + stats.interviews + stats.offers) / total) * 100),
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
    },
    {
      stage: '3. Technical Interviews',
      count: stats.interviews + stats.offers,
      pct: Math.round(((stats.interviews + stats.offers) / total) * 100),
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
    },
    {
      stage: '4. Offers Secured',
      count: stats.offers,
      pct: Math.round((stats.offers / total) * 100),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Recruitment Analytics & Funnel
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics, conversion percentages, and velocity charts of your campus placement drive.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {stats.totalApplications}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recorded in your personal tracker
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interview Call Rate
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-3">
            {stats.interviewRate}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Applications progressing to rounds
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Offer Conversion
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-3">
            {stats.offerRate}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {stats.offers} total placement offers
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Pipeline
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-3">
            {stats.totalApplications - (stats.offers + stats.rejected)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Applications actively under review
          </p>
        </div>
      </div>

      {/* Recruitment Funnel Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Recruitment Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visualize how your applications move from initial submission to final job offer
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {funnelStages.map((stage, idx) => (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  {stage.stage}
                </span>
                <span className={stage.textColor}>
                  {stage.count} ({stage.pct}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(4, stage.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Charts: Monthly Trend Area & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Application vs Offer Momentum
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Timeline view of total submissions and secured offers
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApps)" />
                <Area type="monotone" dataKey="offers" name="Offers" stroke="#10b981" fillOpacity={1} fill="url(#colorOffers)" />
                <Legend verticalAlign="bottom" iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Application Pipeline Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current breakdown of applications across all 5 recruitment stages
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
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
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
