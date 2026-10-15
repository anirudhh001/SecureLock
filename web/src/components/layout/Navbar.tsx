import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDevices } from '../../context/DeviceContext';
import { 
  Shield, 
  Smartphone, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Database, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<Props> = ({ onNavigate, currentPage }) => {
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

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">SECURE<span className="text-cyan-400">LOCK</span></span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">v4.8</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Remote Defense & Lost Mode Console</p>
            </div>
          </div>
        </div>

        {/* Center: Active Device Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-medium text-slate-200 transition-all shadow-inner"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{selectedDevice ? selectedDevice.deviceName : 'Select Device'}</span>
                  {selectedDevice?.status === 'online' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
                  {selectedDevice?.status === 'lost' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showDeviceDropdown && (
              <div className="absolute top-full mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Registered Android Devices ({devices.length})
                </div>
                {devices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      setShowDeviceDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800/60 transition-colors ${
                      selectedDeviceId === device.deviceId ? 'bg-cyan-950/40 border-l-2 border-cyan-400 text-cyan-200' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">{device.deviceName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{device.deviceId} • Bat: {device.battery.level}%</p>
                    </div>
                    <div>
                      {device.status === 'lost' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-950 text-rose-300 font-bold border border-rose-800">LOST</span>
                      ) : device.status === 'online' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 font-medium border border-emerald-800">ONLINE</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400">OFFLINE</span>
                      )}
                    </div>
                  </button>
                ))}
                <div className="px-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onNavigate('devices');
                      setShowDeviceDropdown(false);
                    }}
                    className="w-full py-1 text-center text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    + Register New Android Phone
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lost Mode Active Alert Ribbon */}
          {lostDevices.length > 0 && (
            <button
              onClick={() => onNavigate('lost-mode')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 animate-pulse cyber-glow-danger"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{lostDevices.length} Device in Lost Mode</span>
            </button>
          )}

          {/* Alarm Siren Active Mute Button */}
          {activeAlarm && (
            <button
              onClick={() => {
                devices.forEach((d) => {
                  if (d.alarmActive) stopAlarm(d.deviceId);
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-bounce"
            >
              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
              <span>Mute Alarm</span>
            </button>
          )}
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Simulator Toggle Button */}
          <button
            onClick={toggleSimulator}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isSimulatorOpen 
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 cyber-glow' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Live Android Companion Phone Mockup"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{isSimulatorOpen ? 'Hide Phone' : 'Phone Simulator'}</span>
          </button>

          {/* Security Alert Quick View */}
          <button
            onClick={() => onNavigate('security')}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Security Center Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Backend Connection Indicator */}
          <button
            onClick={() => onNavigate('settings')}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-slate-700 transition-colors"
            title="Backend Settings & Connection Status"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFirebaseActive ? 'Firebase Live' : 'Simulator Mode'}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseActive ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
          </button>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-700 to-indigo-700 flex items-center justify-center font-bold text-white text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'O'}
              </div>
              <span className="hidden md:inline font-medium text-slate-200 max-w-[120px] truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'Owner'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
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
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Account Settings
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800 mt-1"
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
