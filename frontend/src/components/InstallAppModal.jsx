import React from 'react';
import { Download, X, Smartphone, Monitor, Share, PlusSquare, Check } from 'lucide-react';

const InstallAppModal = ({ isOpen, onClose, onInstall, isIOS, isInstallable }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-glow">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Install Placement Tracker
            </h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">
              Android • iOS • Windows • Mac
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          Install Placement Tracker as a native-like standalone app on your mobile home screen or desktop taskbar for fast one-tap access and offline readiness.
        </p>

        {/* Dynamic platform instructions */}
        {isIOS ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-navy-700 space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-brand-600" />
              iPhone & iPad Installation Guide:
            </p>
            <div className="space-y-2 pl-1">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong className="text-slate-900 dark:text-white">Share button</strong> (square with arrow pointing up <Share className="w-3.5 h-3.5 inline mx-0.5 text-brand-600" />) at the bottom of Safari.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-brand-600" />).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tap <strong className="text-slate-900 dark:text-white">Add</strong> in the top right. Placement Tracker will now appear on your iPhone screen!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>Android Smartphone</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> One-tap Install
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Monitor className="w-4 h-4 text-indigo-600" />
                <span>Windows / Mac Desktop</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Standalone Window
              </span>
            </div>

            <button
              onClick={onInstall}
              disabled={!isInstallable}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isInstallable ? 'Install Placement Tracker Now' : 'Open Browser Install Prompt'}</span>
            </button>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallAppModal;
