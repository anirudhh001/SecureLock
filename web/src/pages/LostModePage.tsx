import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  PhoneCall, 
  MessageSquareWarning, 
  CheckCircle2, 
  Smartphone,
  Edit3,
  MapPin,
  Clock,
  KeyRound,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LostModePage: React.FC<Props> = ({ onNavigate }) => {
  const { 
    selectedDevice, 
    activateLostMode, 
    deactivateLostMode 
  } = useDevices();

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
        <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No device selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select an Android device to manage Lost Mode controls.</p>
        <button
          onClick={() => onNavigate('devices')}
          className="cyber-btn-primary text-xs"
        >
          View Devices
        </button>
      </div>
    );
  }

  const isLost = selectedDevice.lostMode;

  const handleDeactivate = async () => {
    setLoading(true);
    await deactivateLostMode(selectedDevice.deviceId);
    setLoading(false);
    setConfirmingDeactivate(false);
  };

  const handleQuickActivate = async () => {
    setLoading(true);
    await activateLostMode(
      selectedDevice.deviceId,
      selectedDevice.lostModeMessage || 'THIS DEVICE HAS BEEN REPORTED AS LOST. Please contact the owner.',
      selectedDevice.recoveryContact || '+1 (555) 019-2834',
      selectedDevice.recoveryNotes || 'Please hand over to reception or call immediately.',
      selectedDevice.devicePin || '1234'
    );
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isLost 
                ? 'bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300' 
                : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
              {isLost ? '🔴 Lost Mode Active' : '🟢 Currently Inactive'}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Target: {selectedDevice.deviceName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Lost Mode
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Protect your device and display a recovery message if your phone is lost.
          </p>
        </div>

        <button
          onClick={() => onNavigate('lost-message')}
          className="cyber-btn-secondary text-xs"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Edit Recovery Message</span>
        </button>
      </div>

      {/* Main Lost Mode Card */}
      <div className={`cyber-card p-6 sm:p-8 transition-all ${
        isLost 
          ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' 
          : 'border-slate-200 dark:border-white/[0.08]'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
          
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isLost 
                ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30' 
                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
            }`}>
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {isLost ? 'Device is in Emergency Lockdown' : 'Protect Misplaced Smartphone'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {isLost 
                  ? 'The device screen is currently locked and displaying your custom recovery notice. Power menu and app multitasking are blocked.'
                  : 'Lost Mode displays a customized emergency message and contact phone number on the phone screen while locking unauthorized access.'
                }
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0">
            {isLost ? (
              <button
                disabled={loading}
                onClick={() => setConfirmingDeactivate(true)}
                className="cyber-btn-secondary text-xs font-semibold px-4 py-2 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Deactivate Lost Mode</span>
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleQuickActivate}
                className="cyber-btn-primary text-xs font-semibold px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Activate Lost Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Details when active or inactive preview */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Recovery message & contact displayed */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquareWarning className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Broadcast Message on Screen
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-2">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                "{selectedDevice.lostModeMessage || 'This device has been reported as lost. Please contact the owner.'}"
              </p>
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-slate-500">Recovery Contact:</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {selectedDevice.recoveryContact || '+1 (555) 019-2834'}
                </span>
              </div>
            </div>
          </div>

          {/* Device Telemetry / Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Security Protocol
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Device Status:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedDevice.status.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Known Coordinates:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {selectedDevice.location.latitude.toFixed(4)}°, {selectedDevice.location.longitude.toFixed(4)}°
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Emergency Override PIN:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">•••• (Configured)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Deactivation Confirmation Modal */}
        {confirmingDeactivate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#141D2E] rounded-xl border border-slate-200 dark:border-white/[0.1] max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Deactivate Lost Mode?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This will unlock your phone screen and dismiss the recovery notice broadcast.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmingDeactivate(false)}
                  className="cyber-btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleDeactivate}
                  className="cyber-btn-primary text-xs bg-rose-600 hover:bg-rose-700"
                >
                  Confirm Deactivate
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Quick Link Card to Custom Message Studio */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141D2E]/60 border border-slate-200 dark:border-white/[0.08] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Need to update your recovery contact or reward?</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Customize the text and phone number displayed on the lost phone screen.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('lost-message')}
          className="cyber-btn-secondary text-xs shrink-0"
        >
          <span>Open Message Studio</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
