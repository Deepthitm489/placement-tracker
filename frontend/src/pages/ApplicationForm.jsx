import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  FileText,
  Calendar,
  Link2,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react';
import { applicationService } from '../services/api';

const statusOptions = [
  { value: 'Applied', label: 'Applied', desc: 'Application submitted, awaiting initial review' },
  { value: 'Online Test', label: 'Online Test', desc: 'Online Assessment / Coding Challenge received' },
  { value: 'Interview', label: 'Interview', desc: 'Technical or HR interview round scheduled' },
  { value: 'Offer', label: 'Offer', desc: 'Job offer letter received' },
  { value: 'Rejected', label: 'Rejected', desc: 'Not progressing further' },
];

const ApplicationForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    jobDescription: '',
    dateApplied: new Date().toISOString().split('T')[0],
    applicationLink: '',
    location: '',
    salary: '',
    status: 'Applied',
    interviewDate: '',
    interviewTime: '',
    notes: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchApp = async () => {
        try {
          const res = await applicationService.getById(id);
          if (res.data?.success && res.data?.application) {
            const app = res.data.application;
            setFormData({
              companyName: app.companyName || '',
              jobRole: app.jobRole || '',
              jobDescription: app.jobDescription || '',
              dateApplied: app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : '',
              applicationLink: app.applicationLink || '',
              location: app.location || '',
              salary: app.salary || '',
              status: app.status || 'Applied',
              interviewDate: app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : '',
              interviewTime: app.interviewTime || '',
              notes: app.notes || '',
            });
          }
        } catch (err) {
          setError(err?.response?.data?.message || 'Failed to fetch application details.');
        } finally {
          setLoading(false);
        }
      };

      fetchApp();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.companyName.trim() || !formData.jobRole.trim()) {
      setError('Please provide both Company Name and Job Role.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        interviewDate: formData.interviewDate ? formData.interviewDate : null,
      };

      if (isEditing) {
        await applicationService.update(id, payload);
        setSuccessMsg('Application updated successfully in database!');
      } else {
        await applicationService.create(payload);
        setSuccessMsg('New application recorded successfully in database!');
      }

      setTimeout(() => {
        navigate('/applications');
      }, 1000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to save application. Please verify your connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading application record...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Application' : 'Add New Placement Application'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? `Update recruitment stages for ${formData.companyName}`
                : 'Record a new company application to track tests, interviews, and offers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Company & Role Info */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-5">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Company & Role Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="companyName"
                  required
                  placeholder="e.g. Google, Microsoft, Infosys"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Job Role / Position *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="jobRole"
                  required
                  placeholder="e.g. Software Engineer, SDE 1, Data Analyst"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Date Applied *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="dateApplied"
                  required
                  value={formData.dateApplied}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Job Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bengaluru, Remote, Hyderabad"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Salary / Package
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="salary"
                  placeholder="e.g. ₹15 LPA or $90,000"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Application or Careers Portal Link
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="applicationLink"
                placeholder="https://careers.company.com/jobs/12345"
                value={formData.applicationLink}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Job Description / Key Qualifications
            </label>
            <textarea
              name="jobDescription"
              rows={3}
              placeholder="Paste brief job specs, required tech stack, eligibility criteria, etc."
              value={formData.jobDescription}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Card 2: Recruitment Status & Interview Schedule */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-5">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recruitment Status & Interview Radar
            </h3>
          </div>

          {/* Status Select Radio Tiles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Current Application Status *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                    formData.status === opt.value
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/50 shadow-xs'
                      : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600 bg-slate-50/50 dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={formData.status === opt.value}
                      onChange={handleChange}
                      className="text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {opt.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Interview Date & Time */}
          <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Video className="w-4 h-4" />
              <span>Upcoming Interview Details (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interview Time
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="interviewTime"
                    placeholder="e.g. 10:30 AM or 15:00"
                    value={formData.interviewTime}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Notes & Interview Preparation Reminders
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="e.g. Review graphs & sliding window algorithms, revise OS concepts, behavioral questions, interviewer names..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/applications"
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 text-sm font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-md shadow-brand-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving to Database...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Application' : 'Save Application'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
