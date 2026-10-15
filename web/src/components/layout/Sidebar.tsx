import React from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Info, 
  MapPin, 
  Radio, 
  Lock, 
  MessageSquareWarning, 
  ShieldAlert, 
  History, 
  Settings,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { selectedDevice, securityEvents } = useDevices();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices', label: 'My Devices', icon: Smartphone },
    { id: 'device-details', label: 'Device Details', icon: Info },
    { id: 'location', label: 'Location Map', icon: MapPin },
    { id: 'controls', label: 'Remote Controls', icon: Radio },
    { 
      id: 'lost-mode', 
      label: 'Lost Mode', 
      icon: Lock, 
      alert: selectedDevice?.lostMode 
    },
    { id: 'lost-message', label: 'Custom Lost Message', icon: MessageSquareWarning },
    { 
      id: 'security', 
      label: 'Security Center', 
      icon: ShieldAlert,
      badge: securityEvents.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').length || undefined
    },
    { id: 'history', label: 'Event History', icon: History },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      
      {/* Navigation List */}
      <div className="p-4 space-y-6">
        
        {/* Device Quick Status Chip */}
        {selectedDevice && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-semibold">
              <span>Controlled Target</span>
              <span className={`flex items-center gap-1 ${selectedDevice.status === 'online' ? 'text-emerald-400' : selectedDevice.status === 'lost' ? 'text-rose-400' : 'text-slate-500'}`}>
                ● {selectedDevice.status.toUpperCase()}
              </span>
            </div>
            <p className="font-bold text-white text-sm truncate mt-1">{selectedDevice.deviceName}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Battery: {selectedDevice.battery.level}%</span>
              <span>OS: Android {selectedDevice.specs.apiLevel >= 34 ? '14' : '13'}</span>
            </div>
          </div>
        )}

        {/* Section Links */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Defense Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                  {item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 ${isActive ? 'opacity-100 text-cyan-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Sidebar Footer Security Compliance */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical Security Protocol</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-400">
            Strictly owner-authorized via Android Device Admin API. Zero permission bypasses.
          </p>
        </div>
      </div>

    </aside>
  );
};
