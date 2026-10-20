import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  MapPin, 
  Radio, 
  Lock, 
  ShieldAlert, 
  History, 
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageSquareWarning
} from 'lucide-react';
import { useDevices } from '../../context/DeviceContext';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
  currentPage, 
  onNavigate,
  isMobileOpen = false,
  onMobileClose 
}) => {
  const { selectedDevice, securityEvents } = useDevices();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'devices', label: 'My Devices', icon: Smartphone },
    { id: 'device-details', label: 'Device Details', icon: Info },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'controls', label: 'Remote Control', icon: Radio },
    { 
      id: 'lost-mode', 
      label: 'Lost Mode', 
      icon: Lock, 
      alert: selectedDevice?.lostMode 
    },
    { id: 'lost-message', label: 'Custom Message', icon: MessageSquareWarning },
    { 
      id: 'security', 
      label: 'Security Center', 
      icon: ShieldAlert,
      badge: securityEvents.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').length || undefined
    },
    { id: 'history', label: 'Activity', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (pageId: string) => {
    onNavigate(pageId);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[65px] left-0 z-50 lg:z-30
        h-full lg:h-[calc(100vh-65px)]
        bg-[#0B1120] border-r border-white/[0.08]
        flex flex-col justify-between shrink-0
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-64'}
        w-64
      `}>
        {/* Top: Header/Controls & Nav list */}
        <div className="p-3.5 space-y-4 overflow-y-auto">
          
          {/* Collapse Toggle for Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-2 border-b border-white/[0.06]">
            {!isCollapsed && (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                Navigation
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors ml-auto"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Device Quick Status (Only when expanded) */}
          {!isCollapsed && selectedDevice && (
            <div className="bg-[#151E2E] border border-white/[0.08] rounded-xl p-3 text-xs shadow-sm">
              <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-400">
                <span>Active Target</span>
                <span className={`flex items-center gap-1.5 ${
                  selectedDevice.status === 'online' 
                    ? 'text-emerald-400' 
                    : selectedDevice.status === 'lost' 
                    ? 'text-rose-400' 
                    : 'text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedDevice.status === 'online' ? 'bg-emerald-400 animate-pulse' : selectedDevice.status === 'lost' ? 'bg-rose-400 animate-ping' : 'bg-slate-500'
                  }`} />
                  {selectedDevice.status}
                </span>
              </div>
              <p className="font-semibold text-white text-xs truncate mt-1">{selectedDevice.deviceName}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
                <span>Bat: {selectedDevice.battery.level}%</span>
                <span>{selectedDevice.network.type}</span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 relative group
                    ${isActive
                      ? 'bg-blue-600/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-500 rounded-r-full" />
                  )}

                  <div className={`flex items-center gap-3 ${isCollapsed ? 'mx-auto' : ''}`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.alert && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                      {item.badge && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Status Indicator */}
        <div className="p-3 border-t border-white/[0.08] space-y-2">
          {!isCollapsed ? (
            <div className="bg-[#151E2E] border border-white/[0.08] rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  System Secure
                </span>
                <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  ARMED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Device Admin API monitoring active.
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="System Secure">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
