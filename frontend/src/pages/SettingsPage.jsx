import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Shield,
  Bell,
  Sun,
  Moon,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/api';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Preference state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminderDays, setInterviewReminderDays] = useState('7');
  const [audioAlerts, setAudioAlerts] = useState(false);
  const [savedPreferencesToast, setSavedPreferencesToast] = useState(false);

  // Data export state
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.data?.success) {
        setPasswordSuccess(res.data?.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message || 'Failed to change password. Please check your current password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = () => {
    setSavedPreferencesToast(true);
    setTimeout(() => setSavedPreferencesToast(false), 3000);
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      setExportSuccess('');
      const res = await authService.exportData();

      if (res.data?.success) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        const dateStr = new Date().toISOString().split('T')[0];
        downloadAnchor.setAttribute('download', `placement-tracker-backup-${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();

        setExportSuccess('Data archive downloaded successfully!');
        setTimeout(() => setExportSuccess(''), 4000);
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to export student data.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!deletePassword) {
      setDeleteError('Please provide your password to confirm account deletion.');
      return;
    }

    try {
      setDeleteLoading(true);
      const res = await authService.deleteAccount({ password: deletePassword });
      if (res.data?.success) {
        setShowDeleteModal(false);
        logout();
        navigate('/login?accountDeleted=true');
      }
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Incorrect password. Account deletion failed.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Portal Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your security credentials, interview radar notifications, and data backups.
        </p>
      </div>

      {/* 1. Security & Password Section */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Password & Security
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ensure your account uses a strong, unique password.
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full text-xs p-3 pr-10 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full text-xs p-3 pr-10 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* 2. Interview Radar & Notification Preferences */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Interview Radar & Alerts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure how and when upcoming placement interviews are highlighted.
            </p>
          </div>
        </div>

        {savedPreferencesToast && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <div className="space-y-5 max-w-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Upcoming Interview Alert Window
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Number of days prior to highlight interviews on your dashboard radar
              </p>
            </div>
            <select
              value={interviewReminderDays}
              onChange={(e) => setInterviewReminderDays(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-200"
            >
              <option value="3">3 Days Prior</option>
              <option value="5">5 Days Prior</option>
              <option value="7">7 Days Prior (Default)</option>
              <option value="14">14 Days Prior</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Email Status Notifications
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Receive email alerts whenever an interview is scheduled or status moves forward
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-navy-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                Audio Chime on Urgent Alerts
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Play an audible chime when opening dashboard if an interview is today or tomorrow
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-navy-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* 3. Appearance & Theme */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Appearance & Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize the look and feel of the placement dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between max-w-xl">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white">
              Current Active Theme
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Switch between High-Contrast Navy Dark mode and Crisp White Light mode
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-2xs hover:bg-slate-100 dark:hover:bg-navy-700 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>Switch to Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Complete Data Export & Backup */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-navy-800">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Portability & Backup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download a complete JSON archive of all your applications, interviews, notes, and activity logs.
            </p>
          </div>
        </div>

        {exportSuccess && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportSuccess}</span>
          </div>
        )}

        <div className="max-w-xl">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            You own 100% of your career data. Exporting generates a standardized JSON file containing your registered profile, every job application, recruitment timelines, interview notes, and activity history.
          </p>
          <button
            type="button"
            onClick={handleExportData}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? 'Generating Archive...' : 'Export Complete Placement Archive (.JSON)'}</span>
          </button>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="bg-rose-50/40 dark:bg-rose-950/20 rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/60 shadow-sm">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-rose-200/60 dark:border-rose-900/40">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Danger Zone: Delete Account
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Permanently wipe your account and all associated placement data.
            </p>
          </div>
        </div>

        <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed max-w-xl mb-4">
          Once deleted, your account cannot be recovered. All application records, interview reminders, activity timelines, and personal notes will be permanently removed from MongoDB Atlas.
        </p>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Permanently Delete My Account</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 max-w-md w-full border border-rose-200 dark:border-rose-900 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold">Confirm Permanent Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action is irreversible. Enter your password below to confirm deletion of student account{' '}
              <span className="font-bold text-slate-900 dark:text-white">{user?.email}</span>.
            </p>

            {deleteError && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter password to confirm"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Yes, Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
