import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDevices } from '../../context/DeviceContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Shield, 
  Smartphone, 
  Bell, 
  ChevronDown, 
  LogOut, 
  VolumeX, 
  AlertTriangle,
  SlidersHorizontal,
  CheckCircle2,
  Menu,
  X,
  Sun,
  Moon,
  Search
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<Props> = ({ 
  onNavigate, 
  currentPage,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    devices, 
    selectedDevice, 
    selectedDeviceId, 
    setSelectedDeviceId,
    toggleSimulator,
    isSimulatorOpen,
    stopAlarm,
    securityEvents
  } = useDevices();

  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const activeAlarm = devices.some((d) => d.alarmActive);
  const lostDevices = devices.filter((d) => d.lostMode);
  const unreadAlerts = securityEvents.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Monitor and protect your registered devices.' },
    devices: { title: 'Devices', subtitle: 'Manage enrolled Android smartphones and tablets.' },
    'device-details': { title: 'Device Details', subtitle: 'Hardware diagnostics and hardware sensors.' },
    location: { title: 'Location', subtitle: 'Real-time GPS tracking and geofencing.' },
    controls: { title: 'Remote Control', subtitle: 'Send commands securely to your devices.' },
    'lost-mode': { title: 'Lost Mode', subtitle: 'Lockdown protection and screen broadcast.' },
    'lost-message': { title: 'Custom Message', subtitle: 'Customize the recovery notice displayed on lost phones.' },
    security: { title: 'Security Center', subtitle: 'Threat detection matrix and anomaly log.' },
    history: { title: 'Activity', subtitle: 'Chronological security events and command history.' },
    settings: { title: 'Settings', subtitle: 'Account preferences, themes, and backend configuration.' },
  };

  const currentMeta = pageTitles[currentPage] || { title: 'SecureLock', subtitle: 'Monitor and protect your registered devices.' };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A0F1C]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/[0.08] px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Button + Brand + Page Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Logo & Name */}
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">
                Secure<span className="text-blue-600 dark:text-blue-400">Lock</span>
              </span>
            </div>
          </div>

          {/* Page Heading and Subtitle */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/[0.08]">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                {currentMeta.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Actions: Device Selector & Quick Notices */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Device Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{selectedDevice ? selectedDevice.deviceName : 'Select Device'}</span>
              {selectedDevice?.status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              {selectedDevice?.status === 'lost' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showDeviceDropdown && (
              <div className="absolute top-full mt-1.5 w-72 bg-white dark:bg-[#182235] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-lg py-1.5 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/[0.06]">
                  Registered Devices ({devices.length})
                </div>
                {devices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      setShowDeviceDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors ${
                      selectedDeviceId === device.deviceId 
                        ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-300 font-medium' 
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{device.deviceName}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Battery: {device.battery.level}%</p>
                    </div>
                    <div>
                      {device.status === 'lost' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 font-medium border border-rose-200 dark:border-rose-500/30">Lost</span>
                      ) : device.status === 'online' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-500/30">Online</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Offline</span>
                      )}
                    </div>
                  </button>
                ))}
                <div className="px-2 pt-1.5 border-t border-slate-100 dark:border-white/[0.06]">
                  <button
                    onClick={() => {
                      onNavigate('devices');
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full py-1 text-center text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    + Add New Device
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lost Mode Indicator */}
          {lostDevices.length > 0 && (
            <button
              onClick={() => onNavigate('lost-mode')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-medium flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>{lostDevices.length} Lost Mode</span>
            </button>
          )}

          {/* Alarm Siren Silencer */}
          {activeAlarm && (
            <button
              onClick={() => {
                devices.forEach((d) => {
                  if (d.alarmActive) stopAlarm(d.deviceId);
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-1.5"
            >
              <VolumeX className="w-3.5 h-3.5 text-amber-500" />
              <span>Mute Alarm</span>
            </button>
          )}
        </div>

        {/* Right: Theme Toggle, Notifications, Phone Simulator, User */}
        <div className="flex items-center gap-2">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-50 dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light/dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Simulator Toggle Button */}
          <button
            onClick={toggleSimulator}
            className={`hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-medium items-center gap-1.5 border transition-all ${
              isSimulatorOpen 
                ? 'bg-blue-50 dark:bg-blue-600/15 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300' 
                : 'bg-slate-50 dark:bg-[#141D2E] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle Live Android Companion Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{isSimulatorOpen ? 'Hide Phone' : 'Phone'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('security')}
            className="relative p-2 rounded-lg bg-slate-50 dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all"
            title="Security Alerts"
            aria-label="View security alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg bg-slate-50 dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] text-xs text-slate-700 dark:text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-semibold text-white text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'O'}
              </div>
              <span className="hidden md:inline font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'Owner'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white dark:bg-[#182235] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-white/[0.06]">
                  <p className="font-medium text-slate-900 dark:text-white">{user?.displayName || 'Device Owner'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> System Protected
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-3.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full px-3.5 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    Settings & Appearance
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                      onNavigate('login');
                    }}
                    className="w-full px-3.5 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
