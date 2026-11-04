import React from 'react';
import { Send, Clock, Video, UserCheck, Award, XCircle, PauseCircle } from 'lucide-react';

const statusConfig = {
  Applied: {
    label: 'Applied',
    icon: Send,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80',
    dotClass: 'bg-blue-500',
  },
  'Online Test': {
    label: 'Online Test',
    icon: Clock,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    dotClass: 'bg-amber-500',
  },
  'Technical Interview': {
    label: 'Technical Interview',
    icon: Video,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    dotClass: 'bg-purple-500',
  },
  // Legacy Interview fallback
  Interview: {
    label: 'Technical Interview',
    icon: Video,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    dotClass: 'bg-purple-500',
  },
  'HR Interview': {
    label: 'HR Interview',
    icon: UserCheck,
    badgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-800/80',
    dotClass: 'bg-fuchsia-500',
  },
  Offer: {
    label: 'Offer',
    icon: Award,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    dotClass: 'bg-emerald-500',
  },
  Rejected: {
    label: 'Rejected',
    icon: XCircle,
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80',
    dotClass: 'bg-rose-500',
  },
  'On Hold': {
    label: 'On Hold',
    icon: PauseCircle,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    dotClass: 'bg-slate-400',
  },
};

const StatusBadge = ({ status, size = 'sm', showIcon = true }) => {
  const config = statusConfig[status] || statusConfig.Applied;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs transition-all ${config.badgeClass} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      {showIcon ? (
        <Icon className={size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
