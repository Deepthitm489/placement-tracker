import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  Edit,
  Trash2,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  Send,
  Sparkles,
} from 'lucide-react';
import { applicationService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import PrintModal from '../components/PrintModal';
import DeleteModal from '../components/DeleteModal';

const STATUS_OPTIONS = [
  'Applied',
  'Online Test',
  'Technical Interview',
  'HR Interview',
  'Offer',
  'Rejected',
  'On Hold',
];

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await applicationService.getById(id);
      if (response.data?.success && response.data?.application) {
        setApplication(response.data.application);
        setSelectedStatus(response.data.application.status);
      } else {
        setError('Application details not found.');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to load application details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const handleQuickStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    setShowStatusModal(true);
  };

  const submitStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setStatusUpdating(true);
      const res = await applicationService.update(id, {
        status: selectedStatus,
        notes: statusNote
          ? `${application.notes ? application.notes + '\n\n' : ''}[${new Date().toLocaleDateString()}] Status changed to ${selectedStatus}: ${statusNote}`
          : application.notes,
      });
      if (res.data?.success) {
        setApplication(res.data.application);
        setShowStatusModal(false);
        setStatusNote('');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await applicationService.delete(id);
      setIsDeleteModalOpen(false);
      navigate('/applications', { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete application.');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDaysRemaining = (interviewDateStr) => {
    if (!interviewDateStr) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const interviewDate = new Date(interviewDateStr);
    const diffTime = interviewDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-navy-800 rounded-lg" />
        <div className="h-44 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800" />
          <div className="h-96 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800" />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-8 text-center bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Unable to View Application</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {error || 'This application does not exist or you do not have permission to view it.'}
        </p>
        <button
          onClick={() => navigate('/applications')}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </button>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(application.interviewDate);
  const isUrgent = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;
  const isPastInterview = daysRemaining !== null && daysRemaining < 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Applications</span>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
            title="Print dossier or export as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <Link
            to={`/applications/edit/${application._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 transition-colors shadow-2xs"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Application</span>
          </Link>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
              {application.companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {application.companyName}
                </h1>
                <StatusBadge status={application.status} size="lg" />
              </div>
              <p className="text-base font-semibold text-brand-600 dark:text-brand-400 mt-1">
                {application.jobRole}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {application.location || 'Location Not Specified'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied on {formatDate(application.dateApplied)}
                </span>
                {application.salary && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    {application.salary}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick links & buttons */}
          <div className="flex flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0">
            {application.applicationLink && (
              <a
                href={
                  application.applicationLink.startsWith('http')
                    ? application.applicationLink
                    : `https://${application.applicationLink}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <span>Job Posting</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {application.companyWebsite && (
              <a
                href={
                  application.companyWebsite.startsWith('http')
                    ? application.companyWebsite
                    : `https://${application.companyWebsite}`
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Company Site</span>
              </a>
            )}
          </div>
        </div>

        {/* Status Transition Pipeline Stepper */}
        <div className="pt-6">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Quick Advance Status:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {STATUS_OPTIONS.map((st) => {
              const isCurrent = application.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleQuickStatusChange(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-400'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Notes (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description Card */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-navy-800">
              <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Job Description & Scope
              </h3>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {application.jobDescription || (
                <span className="text-slate-400 dark:text-slate-500 italic">
                  No job description specified. You can edit this application to attach requirements, skills, and eligibility criteria.
                </span>
              )}
            </div>
          </div>

          {/* Student Preparation Notes */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Student Notes & Interview Prep
                </h3>
              </div>
              <Link
                to={`/applications/edit/${application._id}`}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                Edit Notes
              </Link>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {application.notes || (
                <span className="text-slate-400 dark:text-slate-500 italic">
                  No notes recorded yet. Add coding questions, interview feedback, referral names, or round insights here.
                </span>
              )}
            </div>
          </div>

          {/* Application Activity History Timeline */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-navy-800">
              <History className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recruitment Progress Audit Trail
              </h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-700">
              {(application.activityTimeline && application.activityTimeline.length > 0
                ? application.activityTimeline
                : [
                    {
                      status: application.status,
                      date: application.dateApplied || application.createdAt,
                      note: `Submitted application for ${application.jobRole}`,
                    },
                  ]
              ).map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-navy-900 bg-brand-600 ring-2 ring-brand-100 dark:ring-brand-950" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {event.status}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        • {formatDate(event.date)}
                      </span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interview Schedule & Summary (1 Col) */}
        <div className="space-y-6">
          {/* Interview Radar Panel */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-navy-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Interview Schedule
                </h3>
              </div>
              {application.interviewDate && !isPastInterview && (
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    isUrgent
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  }`}
                >
                  {daysRemaining === 0 ? 'Today!' : daysRemaining === 1 ? 'Tomorrow' : `${daysRemaining} days left`}
                </span>
              )}
            </div>

            {application.interviewDate ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/60">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                    {application.interviewType || 'Online / Video Call'}
                  </p>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {formatDate(application.interviewDate)}
                  </p>
                  {application.interviewTime && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      ⏰ {application.interviewTime}
                    </p>
                  )}
                </div>

                {isPastInterview && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                    Note: This interview date is in the past. Update to your next stage or clear the date.
                  </p>
                )}

                <Link
                  to={`/applications/edit/${application._id}`}
                  className="block text-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
                >
                  Reschedule / Update Interview →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-navy-700 mb-2" />
                <p className="text-xs font-medium">No interview currently scheduled.</p>
                <Link
                  to={`/applications/edit/${application._id}`}
                  className="inline-block mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  + Add Interview Date
                </Link>
              </div>
            )}
          </div>

          {/* Quick Meta Card */}
          <div className="bg-slate-50/70 dark:bg-navy-900/40 rounded-3xl p-6 border border-slate-200/80 dark:border-navy-800 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-navy-800">
              Application Metadata
            </h4>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Record ID:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[150px]">
                {application._id}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Date Created:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {formatDate(application.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Last Modified:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {formatDate(application.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-navy-700 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Update Recruitment Stage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Transition application status to{' '}
              <span className="font-bold text-brand-600 dark:text-brand-400">{selectedStatus}</span>.
            </p>

            <form onSubmit={submitStatusUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Note / Reason:
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Cleared online coding test with 95% score, received invitation for technical interview round..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusUpdating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors disabled:opacity-50"
                >
                  {statusUpdating ? 'Updating...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Modal Component */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        application={application}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        companyName={application.companyName}
        loading={isDeleting}
      />
    </div>
  );
};

export default ApplicationDetails;
