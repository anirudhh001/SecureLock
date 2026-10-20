import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDevices } from '../../context/DeviceContext';
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
  X
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
  const { user, logout, isFirebaseActive } = useAuth();
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
    dashboard: { title: 'Dashboard', subtitle: 'Overview & Device Telemetry' },
    devices: { title: 'My Devices', subtitle: 'Enrolled Android Hardware' },
    'device-details': { title: 'Device Details', subtitle: 'Hardware Diagnostics & Logs' },
    location: { title: 'Location Map', subtitle: 'Live Geolocation & Breadcrumbs' },
    controls: { title: 'Remote Control', subtitle: 'Command Execution Center' },
    'lost-mode': { title: 'Lost Mode', subtitle: 'Emergency Lockdown & Screen Broadcast' },
    'lost-message': { title: 'Custom Message', subtitle: 'Recovery Broadcast Editor' },
    security: { title: 'Security Center', subtitle: 'SOC Threat Matrix & Anomaly Detection' },
    history: { title: 'Activity', subtitle: 'Audit Logs & Timeline' },
    settings: { title: 'Settings', subtitle: 'Owner Profile & Backend Configuration' },
  };

  const currentMeta = pageTitles[currentPage] || { title: 'SecureLock', subtitle: 'Device Security Console' };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-b border-white/[0.08] px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu Button + Brand + Page Title */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
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
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide text-white">SECURE<span className="text-blue-400">LOCK</span></span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 border border-white/[0.06]">SOC</span>
              </div>
            </div>
          </div>

          {/* Divider & Breadcrumb */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-white/[0.08]">
            <div>
              <h2 className="text-sm font-semibold text-white leading-tight">{currentMeta.title}</h2>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">{currentMeta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher & Urgent Alerts */}
        <div className="hidden lg:flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151E2E] border border-white/[0.08] hover:border-blue-500/40 text-xs font-medium text-slate-200 transition-all shadow-sm"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-white">{selectedDevice ? selectedDevice.deviceName : 'Select Device'}</span>
              {selectedDevice?.status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              {selectedDevice?.status === 'lost' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showDeviceDropdown && (
              <div className="absolute top-full mt-2 w-72 bg-[#1A2537] border border-white/[0.1] rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-3.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                  Registered Devices ({devices.length})
                </div>
                {devices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      setShowDeviceDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between hover:bg-white/[0.04] transition-colors ${
                      selectedDeviceId === device.deviceId ? 'bg-blue-600/10 border-l-2 border-blue-500 text-blue-200' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white">{device.deviceName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{device.deviceId} • Bat: {device.battery.level}%</p>
                    </div>
                    <div>
                      {device.status === 'lost' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">LOST</span>
                      ) : device.status === 'online' ? (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30">ONLINE</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400">OFFLINE</span>
                      )}
                    </div>
                  </button>
                ))}
                <div className="px-2 pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => {
                      onNavigate('devices');
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full py-1 text-center text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    + Register New Android Phone
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lost Mode Ribbon */}
          {lostDevices.length > 0 && (
            <button
              onClick={() => onNavigate('lost-mode')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{lostDevices.length} in Lost Mode</span>
            </button>
          )}

          {/* Alarm Siren Mute Button */}
          {activeAlarm && (
            <button
              onClick={() => {
                devices.forEach((d) => {
                  if (d.alarmActive) stopAlarm(d.deviceId);
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              <span>Mute Alarm</span>
            </button>
          )}
        </div>

        {/* Right: Simulator Button, Notifications, User Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Simulator Toggle Button */}
          <button
            onClick={toggleSimulator}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
              isSimulatorOpen 
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300' 
                : 'bg-[#151E2E] border-white/[0.08] text-slate-300 hover:text-white'
            }`}
            title="Toggle Live Android Companion Phone Mockup"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{isSimulatorOpen ? 'Hide Phone' : 'Phone Simulator'}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('security')}
            className="relative p-2 rounded-xl bg-[#151E2E] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:text-white transition-all"
            title="Security Center Alerts"
            aria-label="View security alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-[#151E2E] border border-white/[0.08] hover:border-white/[0.15] text-xs text-slate-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'O'}
              </div>
              <span className="hidden md:inline font-medium text-slate-200 max-w-[120px] truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'Owner'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#1A2537] border border-white/[0.1] rounded-2xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2.5 border-b border-white/[0.06]">
                  <p className="font-semibold text-white">{user?.displayName || 'Device Owner'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Authenticated Owner
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-white/[0.04] flex items-center gap-2 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Account Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-400 hover:bg-white/[0.04] flex items-center gap-2 border-t border-white/[0.06] mt-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
