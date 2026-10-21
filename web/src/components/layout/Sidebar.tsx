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
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquareWarning,
  SlidersHorizontal,
  CheckCircle2
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
    { id: 'devices', label: 'Devices', icon: Smartphone },
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[57px] left-0 z-50 lg:z-30
        h-full lg:h-[calc(100vh-57px)]
        bg-white dark:bg-[#0A0F1C] border-r border-slate-200 dark:border-white/[0.08]
        flex flex-col justify-between shrink-0
        transition-all duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-60'}
        w-60
      `}>
        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto">
          
          {/* Collapse Toggle for Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-white/[0.06]">
            {!isCollapsed && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                Menu
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors ml-auto"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-0.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium
                    transition-all duration-150 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-600/15 dark:text-blue-300' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                    }
                    ${isCollapsed ? 'justify-center px-2' : ''}
                  `}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r" />
                  )}

                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`} />
                  
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {/* Lost Mode Indicator */}
                  {!isCollapsed && item.alert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}

                  {/* Badge */}
                  {!isCollapsed && item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: System Protected Status */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
          <div className={`flex items-center gap-2.5 px-2 py-1.5 ${isCollapsed ? 'justify-center px-0' : ''}`}>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">System Protected</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Zero Threats Active</p>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
};
