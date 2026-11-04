import React from 'react';
import { X, Printer, Building2, MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header (Hidden on Print) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-navy-700 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Application Summary & Print View
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-4 text-slate-800 dark:text-slate-100">
          <div className="border-b border-slate-200 dark:border-navy-700 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-brand-600 dark:text-brand-400">
                  Placement Tracker Dossier
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {application.companyName}
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                  {application.jobRole}
                </p>
              </div>
              <div>
                <StatusBadge status={application.status} size="md" />
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Date Applied
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(application.dateApplied)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {application.location || 'Not Specified'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Package
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {application.salary || 'Undisclosed'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-navy-800 rounded-xl border border-slate-100 dark:border-navy-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Interview Date
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {application.interviewDate ? `${formatDate(application.interviewDate)} ${application.interviewTime ? `(${application.interviewTime})` : ''}` : 'Not scheduled'}
              </p>
            </div>
          </div>

          {/* Job Description */}
          {application.jobDescription && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Job Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-navy-800/60 p-4 rounded-xl border border-slate-100 dark:border-navy-700">
                {application.jobDescription}
              </p>
            </div>
          )}

          {/* Interview Details & Prep Notes */}
          {application.notes && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                Interview Prep & Student Notes
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-navy-800/60 p-4 rounded-xl border border-slate-100 dark:border-navy-700">
                {application.notes}
              </p>
            </div>
          )}

          {/* Application Portal Link */}
          {application.applicationLink && (
            <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span className="font-medium">Application Portal:</span>
              <a
                href={application.applicationLink}
                target="_blank"
                rel="noreferrer"
                className="underline truncate hover:text-brand-700 dark:hover:text-brand-300"
              >
                {application.applicationLink}
              </a>
            </div>
          )}

          {/* Timestamp footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-navy-700 text-xs text-slate-400 dark:text-slate-500 flex justify-between">
            <span>Generated from Placement Tracker System</span>
            <span>Recorded on: {new Date(application.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
