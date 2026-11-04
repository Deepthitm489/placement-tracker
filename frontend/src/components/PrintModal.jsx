import React from 'react';
import { X, Printer, Building2, MapPin, Calendar, DollarSign, ExternalLink, Globe, Clock, History } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PrintModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const timeline = application.activityTimeline || [
    { status: application.status, date: application.dateApplied || application.createdAt, note: 'Initial submission' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header (Hidden on Print) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-navy-700 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Application Dossier & Official Record
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-6 text-slate-800 dark:text-slate-100">
          <div className="border-b border-slate-200 dark:border-navy-700 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-brand-600 dark:text-brand-400">
                  Placement Tracker • Student Dossier
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {application.companyName}
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                  {application.jobRole}
                </p>
              </div>
              <div>
                <StatusBadge status={application.status} size="md" />
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-1">
            <div className="p-3.5 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Date Applied
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatDate(application.dateApplied)}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {application.location || 'Not Specified'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Package / CTC
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {application.salary || 'Undisclosed'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-navy-800 rounded-2xl border border-slate-100 dark:border-navy-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> Interview Schedule
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {application.interviewDate ? `${formatDate(application.interviewDate)}` : 'Not scheduled'}
              </p>
            </div>
          </div>

          {/* Interview Details if scheduled */}
          {application.interviewDate && (
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/80 space-y-2">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                Interview Logistics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Date:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{formatDate(application.interviewDate)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Time:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{application.interviewTime || 'TBD'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Format:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{application.interviewType || 'Online'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline (Phase 5) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4 text-brand-600" />
              Recruitment Progress Timeline
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-navy-700">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-4 ring-white dark:ring-navy-900" />
                  <div className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{item.status}</span>
                      <span className="text-[11px] text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    {item.note && <p className="text-slate-600 dark:text-slate-300 mt-0.5 text-[11px]">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Description */}
          {application.jobDescription && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">
                Job Description
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-navy-800/60 p-4 rounded-2xl border border-slate-100 dark:border-navy-700">
                {application.jobDescription}
              </p>
            </div>
          )}

          {/* Interview Notes */}
          {application.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">
                Student Notes & Technical Preparation
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-navy-800/60 p-4 rounded-2xl border border-slate-100 dark:border-navy-700">
                {application.notes}
              </p>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
            {application.companyWebsite && (
              <a
                href={application.companyWebsite}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Company Website</span>
              </a>
            )}
            {application.applicationLink && (
              <a
                href={application.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Job Application Portal</span>
              </a>
            )}
          </div>

          {/* Timestamp footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-navy-700 text-[11px] text-slate-400 flex justify-between">
            <span>Generated from Placement Tracker – Smart Student Placement System</span>
            <span>Recorded on: {new Date(application.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
