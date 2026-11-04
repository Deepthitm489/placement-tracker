import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Globe,
} from 'lucide-react';
import { applicationService } from '../services/api';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(120),
  jobRole: z.string().min(1, 'Job role is required').max(120),
  jobDescription: z.string().optional(),
  companyWebsite: z.string().optional(),
  applicationLink: z.string().optional(),
  location: z.string().optional(),
  salary: z.string().optional(),
  dateApplied: z.string().min(1, 'Application date is required'),
  status: z.enum([
    'Applied',
    'Online Test',
    'Technical Interview',
    'HR Interview',
    'Offer',
    'Rejected',
    'On Hold',
  ]),
  interviewDate: z.string().optional(),
  interviewTime: z.string().optional(),
  interviewType: z.enum([
    'Online / Video Call',
    'On-Campus',
    'In-Person',
    'Phone Screening',
    'Not specified',
  ]),
  notes: z.string().optional(),
});

const statusOptions = [
  { value: 'Applied', label: 'Applied', desc: 'Application submitted, awaiting screening' },
  { value: 'Online Test', label: 'Online Test', desc: 'Online coding assessment / OA challenge' },
  { value: 'Technical Interview', label: 'Technical Interview', desc: 'DSA, System Design, coding round' },
  { value: 'HR Interview', label: 'HR Interview', desc: 'Managerial & culture fit discussion' },
  { value: 'Offer', label: 'Offer', desc: 'Official job offer letter received' },
  { value: 'Rejected', label: 'Rejected', desc: 'Application discontinued' },
  { value: 'On Hold', label: 'On Hold', desc: 'Hiring committee review on hold' },
];

const ApplicationForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      jobRole: '',
      jobDescription: '',
      companyWebsite: '',
      applicationLink: '',
      location: '',
      salary: '',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Applied',
      interviewDate: '',
      interviewTime: '',
      interviewType: 'Online / Video Call',
      notes: '',
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (isEditing) {
      const fetchApp = async () => {
        try {
          const res = await applicationService.getById(id);
          if (res.data?.success && res.data?.application) {
            const app = res.data.application;
            setValue('companyName', app.companyName || '');
            setValue('jobRole', app.jobRole || '');
            setValue('jobDescription', app.jobDescription || '');
            setValue('companyWebsite', app.companyWebsite || '');
            setValue('applicationLink', app.applicationLink || '');
            setValue('location', app.location || '');
            setValue('salary', app.salary || '');
            setValue(
              'dateApplied',
              app.dateApplied ? new Date(app.dateApplied).toISOString().split('T')[0] : ''
            );
            // Handle legacy 'Interview' status
            setValue(
              'status',
              app.status === 'Interview' ? 'Technical Interview' : app.status || 'Applied'
            );
            setValue(
              'interviewDate',
              app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : ''
            );
            setValue('interviewTime', app.interviewTime || '');
            setValue('interviewType', app.interviewType || 'Online / Video Call');
            setValue('notes', app.notes || '');
          }
        } catch (err) {
          setError(err?.response?.data?.message || 'Failed to fetch application details.');
        } finally {
          setLoading(false);
        }
      };

      fetchApp();
    }
  }, [id, isEditing, setValue]);

  const onSubmit = async (data) => {
    setError('');
    try {
      setSubmitting(true);
      const payload = {
        ...data,
        interviewDate: data.interviewDate ? data.interviewDate : null,
      };

      if (isEditing) {
        await applicationService.update(id, payload);
        setSuccessMsg('Application updated successfully in database!');
      } else {
        await applicationService.create(payload);
        setSuccessMsg('New placement application recorded successfully!');
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
      <div className="max-w-4xl mx-auto p-12 text-center bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-navy-800">
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
            className="p-2 rounded-2xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEditing ? 'Edit Application' : 'Add Placement Application'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEditing
                ? 'Update company status, interview dates, and preparation notes'
                : 'Record a new company application to track online tests, interviews, and offers.'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Company & Role Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-5">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Company & Role Logistics
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
                  placeholder="e.g. Google, Microsoft, Adobe, Infosys"
                  {...register('companyName')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
              {errors.companyName && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Job Role / Designation *
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Software Engineer, SDE 1, Data Analyst"
                  {...register('jobRole')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
              {errors.jobRole && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.jobRole.message}</p>
              )}
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
                  {...register('dateApplied')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
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
                  placeholder="e.g. Bengaluru, Remote, Hyderabad"
                  {...register('location')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Salary / Package (CTC)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. ₹18 LPA or $85,000"
                  {...register('salary')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Company Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://company.com"
                  {...register('companyWebsite')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Application / Career Portal Link
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://careers.company.com/job/12345"
                  {...register('applicationLink')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Job Description / Tech Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Paste required tech stack, eligibility cutoff, round format, etc."
              {...register('jobDescription')}
              className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* Card 2: 7-Stage Status & Interview Radar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-subtle space-y-5">
          <div className="border-b border-slate-100 dark:border-navy-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recruitment Progress Stage (7 Stages)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Current Stage *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                    selectedStatus === opt.value
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/60 shadow-2xs ring-1 ring-brand-500'
                      : 'border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600 bg-slate-50/50 dark:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('status')}
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

          {/* Interview Details */}
          <div className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Video className="w-4 h-4" />
              <span>Upcoming Interview Logistics (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  {...register('interviewDate')}
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
                    placeholder="e.g. 10:30 AM or 15:00"
                    {...register('interviewTime')}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interview Format / Type
                </label>
                <select
                  {...register('interviewType')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Online / Video Call">Online / Video Call</option>
                  <option value="On-Campus">On-Campus Drive</option>
                  <option value="In-Person">In-Person Office</option>
                  <option value="Phone Screening">Phone Screening</option>
                  <option value="Not specified">Not specified</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Personal Interview Prep & Technical Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Revise Dynamic Programming, Graph traversal, OS scheduling algorithms, interviewer name, and questions to ask..."
              {...register('notes')}
              className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/applications"
            className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <span>Saving...</span>
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
