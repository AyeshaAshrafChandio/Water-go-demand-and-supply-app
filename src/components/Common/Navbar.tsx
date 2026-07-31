import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../locales/translations';
import { 
  Droplets, 
  Globe, 
  Bell, 
  User as UserIcon, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Volume2
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    activeRole, 
    setActiveRole, 
    notifications, 
    markNotificationAsRead,
    currentUser
  } = useApp();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="max-w-md md:max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-900/40">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-sky-100 to-white bg-clip-text text-transparent">
                {getTranslation(language, 'appName')}
              </h1>
              <p className="text-[10px] text-cyan-300 font-medium tracking-wide">
                {language === 'ur' ? 'پانی کی فوری ڈلیوری' : 'InDrive for Water'}
              </p>
            </div>
          </div>

          {/* Controls: Language, Notifications, Profile */}
          <div className="flex items-center space-x-2">
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold"
            >
              {currentUser.name.charAt(0)}
            </button>
          </div>
        </div>

        {/* Multi-Role Quick Switch Bar */}
        <div className="bg-slate-950 border-t border-slate-800/80 py-1.5 px-3">
          <div className="max-w-md md:max-w-5xl mx-auto flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">
              {getTranslation(language, 'switchRole')}
            </span>

            <div className="flex items-center space-x-1 w-full sm:w-auto justify-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => handleRoleChange('customer')}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all text-xs ${
                  activeRole === 'customer'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'customer')}</span>
              </button>

              <button
                onClick={() => handleRoleChange('supplier')}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all text-xs ${
                  activeRole === 'supplier'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'supplier')}</span>
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition-all text-xs ${
                  activeRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'admin')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-slate-900 text-white h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifDrawer(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-500 py-8 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      n.read
                        ? 'bg-slate-900/50 border-slate-800 text-slate-400'
                        : 'bg-cyan-950/40 border-cyan-800/60 text-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-cyan-300">
                        {language === 'ur' ? n.titleUr : n.titleEn}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      )}
                    </div>
                    <p className="mt-1 text-slate-300">
                      {language === 'ur' ? n.bodyUr : n.bodyEn}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-2 block">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full text-white shadow-2xl relative">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-600 text-white font-extrabold text-2xl flex items-center justify-center border-4 border-cyan-400/30">
                {currentUser.name.charAt(0)}
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-100">{currentUser.name}</h3>
              <p className="text-xs text-cyan-400 font-mono">{currentUser.phone}</p>
              
              <div className="mt-4 w-full bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Current Role:</span>
                  <span className="text-cyan-300 font-bold uppercase">{activeRole}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rating:</span>
                  <span className="text-amber-400 font-bold">⭐ {currentUser.rating}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>City:</span>
                  <span className="text-slate-200">Karachi, Pakistan</span>
                </div>
              </div>

              <div className="mt-5 w-full">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-xs transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
