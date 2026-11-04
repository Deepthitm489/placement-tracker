import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  CalendarDays,
  BarChart3,
  UserCircle,
  LogOut,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Applications', path: '/applications', icon: Briefcase },
  { name: 'Add Application', path: '/applications/new', icon: PlusCircle },
  { name: 'Interviews', path: '/interviews', icon: CalendarDays },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile', path: '/profile', icon: UserCircle },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-navy-900 dark:bg-navy-950 text-slate-200 border-r border-navy-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white shadow-glow">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                  Placement Tracker
                </h1>
                <p className="text-xs text-brand-300 font-medium">Student Portal</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom Section */}
        <div className="p-4 border-t border-navy-800 bg-navy-900/60 dark:bg-navy-950/80">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-navy-800/60">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'Student'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.college || user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
