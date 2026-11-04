import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Sparkles,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  WifiOff,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { usePWA } from '../hooks/usePWA';
import InstallAppModal from './InstallAppModal';
import { dashboardService, applicationService, notificationService } from '../services/api';

const Navbar = ({ onOpenSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { isInstallable, isIOS, isOnline, installApp } = usePWA();
  const navigate = useNavigate();

  const [urgentInterviews, setUrgentInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState('');

  const fetchRemindersAndNotifications = async () => {
    try {
      const [interviewsRes, notifRes] = await Promise.allSettled([
        dashboardService.getInterviews(),
        notificationService.getAll(),
      ]);

      if (interviewsRes.status === 'fulfilled' && interviewsRes.value.data?.success) {
        const urgent = (interviewsRes.value.data.interviews || []).filter((i) => i.isUrgent);
        setUrgentInterviews(urgent);
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.data?.success) {
        setNotifications(notifRes.value.data.notifications || []);
        setUnreadNotifications(notifRes.value.data.unreadCount || 0);
      }
    } catch (err) {
      // Silently handle
    }
  };

  useEffect(() => {
    fetchRemindersAndNotifications();
    const interval = setInterval(fetchRemindersAndNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSeedDemo = async () => {
    if (confirm('Load realistic sample placement applications for demonstration?')) {
      try {
        setSeeding(true);
        const res = await applicationService.seedDemo();
        setSeedSuccess(res.data?.message || 'Sample data loaded!');
        setTimeout(() => {
          setSeedSuccess('');
          window.location.reload();
        }, 1200);
      } catch (err) {
        alert(err?.response?.data?.message || 'Failed to load demo data');
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadNotifications(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      //
    }
  };

  return (
    <>
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-900 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Viewing cached application shell. Changes will sync when reconnected.</span>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 transition-colors">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
          {/* Left: Mobile hamburger & welcome */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Student Recruitment 2026
              </span>
              <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white truncate">
                Welcome back, <span className="text-brand-600 dark:text-brand-400">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
              </h2>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Install App Button */}
            <button
              onClick={() => setShowInstallModal(true)}
              title="Install Placement Tracker as a Mobile App"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 transition-all shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Install App</span>
            </button>

            {/* Demo Mode Button */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              title="Load realistic sample student applications"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/60 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{seeding ? 'Loading...' : 'Demo Data'}</span>
            </button>

            {/* Seed Feedback Toast */}
            {seedSuccess && (
              <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-medium rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{seedSuccess}</span>
              </div>
            )}

            {/* Interview & System Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {(urgentInterviews.length > 0 || unreadNotifications > 0) && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[10px] font-bold items-center justify-center">
                      {urgentInterviews.length + unreadNotifications}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 p-4 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Notifications & Alerts
                      </h4>
                    </div>
                    {unreadNotifications > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {/* Urgent Interview Alerts */}
                    {urgentInterviews.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/interviews');
                        }}
                        className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 border border-purple-200/70 dark:border-purple-900/60 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            📅 {item.companyName}
                          </p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                            {item.daysRemaining === 0 ? 'Today!' : item.daysRemaining === 1 ? 'Tomorrow' : `In ${item.daysRemaining} days`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {item.jobRole} ({item.interviewType || 'Interview'})
                        </p>
                      </div>
                    ))}

                    {/* General Notifications */}
                    {notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          setShowNotifications(false);
                          if (notif.link) navigate(notif.link);
                        }}
                        className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                          notif.read
                            ? 'bg-slate-50/50 dark:bg-navy-950/40 border-slate-100 dark:border-navy-800'
                            : 'bg-brand-50/60 dark:bg-brand-950/40 border-brand-200/80 dark:border-brand-900/60'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))}

                    {urgentInterviews.length === 0 && notifications.length === 0 && (
                      <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
                        No new notifications or interview alerts.
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-navy-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/interviews');
                      }}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      View All Scheduled Interviews →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* User Profile Avatar shortcut */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-200 hover:opacity-80 transition-opacity"
              title="View Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-purple text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstall={installApp}
        isIOS={isIOS}
        isInstallable={isInstallable}
      />
    </>
  );
};

export default Navbar;
