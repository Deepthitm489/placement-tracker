import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Printer,
  RotateCcw,
  Calendar,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  List,
  Globe,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { applicationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import DeleteModal from '../components/DeleteModal';
import PrintModal from '../components/PrintModal';

const statusOptions = [
  'All',
  'Applied',
  'Online Test',
  'Technical Interview',
  'HR Interview',
  'Offer',
  'Rejected',
  'On Hold',
];

const ApplicationsList = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters, Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal States
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [printTarget, setPrintTarget] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        q: searchQuery,
        status: selectedStatus,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy,
        page,
        limit: 15,
      };

      const res = await applicationService.getAll(params);
      if (res.data?.success) {
        setApplications(res.data.applications || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalCount || res.data.applications?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus, startDate, endDate, sortBy, page]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    setPage(1);
  };

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.update(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await applicationService.delete(deleteTarget._id);
      setApplications((prev) => prev.filter((app) => app._id !== deleteTarget._id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete application.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Export applications to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No applications to export.');
      return;
    }

    const headers = [
      'Company Name',
      'Job Role',
      'Status',
      'Date Applied',
      'Location',
      'Salary',
      'Interview Date',
      'Interview Time',
      'Interview Type',
      'Company Website',
      'Application Link',
      'Notes',
    ];

    const rows = applications.map((app) => [
      `"${app.companyName.replace(/"/g, '""')}"`,
      `"${app.jobRole.replace(/"/g, '""')}"`,
      `"${app.status}"`,
      `"${new Date(app.dateApplied).toLocaleDateString()}"`,
      `"${(app.location || '').replace(/"/g, '""')}"`,
      `"${(app.salary || '').replace(/"/g, '""')}"`,
      `"${app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : ''}"`,
      `"${app.interviewTime || ''}"`,
      `"${app.interviewType || ''}"`,
      `"${(app.companyWebsite || '').replace(/"/g, '""')}"`,
      `"${(app.applicationLink || '').replace(/"/g, '""')}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `placement_tracker_applications_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      await applicationService.seedDemo();
      await fetchApplications();
    } catch (err) {
      alert('Failed to seed sample applications');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Showing {applications.length} of {totalCount} total opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 text-xs font-bold shadow-2xs transition-colors"
            title="Export all applications to Excel-compatible CSV spreadsheet"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
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

      {/* Filter and Search Bar Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name, job role, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  Stage: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="newest">Newest Applied</option>
              <option value="oldest">Oldest Applied</option>
              <option value="company_asc">Company (A-Z)</option>
              <option value="company_desc">Company (Z-A)</option>
              <option value="interview_date">Interview Date</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* View Toggle & Reset */}
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={handleClearFilters}
              className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center rounded-2xl border border-slate-200 dark:border-navy-700 p-0.5 bg-slate-100 dark:bg-navy-950">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-navy-800 text-brand-600 dark:text-brand-400 shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter Collapsible Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-navy-800/80 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date Applied:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950 text-slate-800 dark:text-slate-200 text-xs"
            />
          </div>

          {(searchQuery || selectedStatus !== 'All' || startDate || endDate) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading your applications...
          </p>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-dashed border-slate-300 dark:border-navy-800">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-navy-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Applications Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'All' || startDate || endDate
              ? 'No applications match your active filters. Try resetting filters.'
              : 'You have not added any placement opportunities yet. Add your first application or explore with sample data.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery || selectedStatus !== 'All' || startDate || endDate ? (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-2xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200"
              >
                Clear Filters
              </button>
            ) : (
              <>
                <Link
                  to="/applications/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Application
                </Link>
                <button
                  onClick={handleSeedDemo}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Sample Data
                </button>
              </>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 dark:bg-navy-950/70 border-b border-slate-200 dark:border-navy-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Company & Role</th>
                  <th className="py-3.5 px-4 font-bold">Stage Status</th>
                  <th className="py-3.5 px-4 font-bold hidden md:table-cell">Applied Date</th>
                  <th className="py-3.5 px-4 font-bold hidden lg:table-cell">Location & CTC</th>
                  <th className="py-3.5 px-4 font-bold hidden xl:table-cell">Interview</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-navy-800/50 transition-colors"
                  >
                    {/* Company & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-navy-800 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {app.companyName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {app.companyName}
                            </span>
                            {app.companyWebsite && (
                              <a
                                href={app.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-brand-600"
                                title="Visit company website"
                              >
                                <Globe className="w-3 h-3" />
                              </a>
                            )}
                            {app.applicationLink && (
                              <a
                                href={app.applicationLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-brand-600"
                                title="Open application portal"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {app.jobRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status with Quick Update Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={app.status === 'Interview' ? 'Technical Interview' : app.status}
                          onChange={(e) => handleQuickStatusChange(app._id, e.target.value)}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Online Test">Online Test</option>
                          <option value="Technical Interview">Technical Interview</option>
                          <option value="HR Interview">HR Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                        <div className="cursor-pointer group flex items-center gap-1">
                          <StatusBadge status={app.status} size="xs" />
                          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                        </div>
                      </div>
                    </td>

                    {/* Date Applied */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-600 dark:text-slate-300">
                      {new Date(app.dateApplied).toLocaleDateString()}
                    </td>

                    {/* Location & Salary */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-600 dark:text-slate-300">
                      <div>{app.location || 'Not specified'}</div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {app.salary || '—'}
                      </div>
                    </td>

                    {/* Interview Date */}
                    <td className="py-3.5 px-4 hidden xl:table-cell text-xs">
                      {app.interviewDate ? (
                        <div className="text-purple-700 dark:text-purple-300 font-semibold">
                          📅 {new Date(app.interviewDate).toLocaleDateString()}
                          {app.interviewTime && ` (${app.interviewTime})`}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPrintTarget(app)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                          title="Print / View dossier"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/applications/edit/${app._id}`)}
                          className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                          title="Edit application"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                          title="Delete application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-navy-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-navy-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-navy-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle flex flex-col justify-between hover:border-brand-500 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">
                        {app.companyName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {app.jobRole}
                      </p>
                    </div>
                    <StatusBadge status={app.status} size="xs" />
                  </div>

                  <div className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applied: {new Date(app.dateApplied).toLocaleDateString()}</span>
                    </div>
                    {app.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.location}</span>
                      </div>
                    )}
                    {app.salary && (
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {app.salary}
                        </span>
                      </div>
                    )}
                    {app.interviewDate && (
                      <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Interview: {new Date(app.interviewDate).toLocaleDateString()}{' '}
                          {app.interviewTime && `at ${app.interviewTime}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {app.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-800/60 p-2.5 rounded-2xl line-clamp-2 mt-2">
                      {app.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {app.companyWebsite && (
                      <a
                        href={app.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-brand-600"
                        title="Company Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {app.applicationLink && (
                      <a
                        href={app.applicationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPrintTarget(app)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800"
                      title="Print dossier"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/applications/edit/${app._id}`)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800"
                      title="Edit application"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(app)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls in Grid */}
          {totalPages > 1 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={`Delete application for ${deleteTarget?.companyName}?`}
        message={`Are you sure you want to permanently delete your application for "${deleteTarget?.jobRole}" at ${deleteTarget?.companyName}?`}
      />

      {/* Print / View Modal */}
      <PrintModal
        isOpen={!!printTarget}
        onClose={() => setPrintTarget(null)}
        application={printTarget}
      />
    </div>
  );
};

export default ApplicationsList;
