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
  KeyRound
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
      <div className="cyber-card p-12 text-center text-slate-400 space-y-3">
        <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No device selected</h3>
        <p className="text-xs text-slate-400">Please select an Android device to manage Lost Mode controls.</p>
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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              isLost 
                ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300 cyber-glow-danger' 
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
              {isLost ? 'Lost Mode Active' : 'Currently Inactive'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Lost Mode
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Protect your device and display a recovery message if your phone is lost.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('lost-message')}
            className="cyber-btn-secondary text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Customize Message & Contact</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Status, Actions & Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Lost Mode State & Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dedicated Lost Mode Card */}
          <div className={`cyber-card p-6 border transition-all ${
            isLost 
              ? 'border-rose-500/40 bg-rose-950/[0.15] cyber-glow-danger' 
              : 'border-white/[0.08]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isLost 
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400' 
                    : 'bg-[#1A2537] border border-white/[0.08] text-slate-400'
                }`}>
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isLost ? '🔴 Lost Mode Active' : '🟢 Currently Inactive'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    "Protect your device and display a recovery message if your phone is lost."
                  </p>
                </div>
              </div>

              {/* State Action Buttons */}
              {isLost ? (
                <button
                  onClick={() => setConfirmingDeactivate(true)}
                  disabled={loading}
                  className="cyber-btn-primary bg-emerald-600 hover:bg-emerald-500 text-xs shadow-md shadow-emerald-950/40"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Deactivate Lost Mode</span>
                </button>
              ) : (
                <button
                  onClick={handleQuickActivate}
                  disabled={loading}
                  className="cyber-btn-danger text-xs px-5 py-2.5 font-bold"
                >
                  <Lock className="w-4 h-4" />
                  <span>Activate Lost Mode</span>
                </button>
              )}
            </div>

            {/* When Active: Display Custom Message, Recovery Contact, Time, Location */}
            <div className="mt-5 space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareWarning className="w-4 h-4 text-blue-400" />
                Active Recovery Broadcast Details
              </span>

              <div className="bg-[#1A2537] border border-white/[0.08] rounded-xl p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Custom Message</span>
                  <p className="text-white font-medium mt-1 text-sm leading-relaxed">
                    "{selectedDevice.lostModeMessage || 'This device has been reported as lost. Please contact the owner.'}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Recovery Contact</span>
                    <p className="font-mono text-blue-400 font-bold mt-0.5">
                      {selectedDevice.recoveryContact || '+1 (555) 019-2834'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner Deactivation PIN (Web Console Only)</span>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{selectedDevice.devicePin || '1234'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Activation / Polled Time
                    </span>
                    <p className="text-slate-300 font-medium mt-0.5">
                      {new Date(selectedDevice.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Last Known Location
                    </span>
                    <p className="text-slate-300 font-medium mt-0.5 truncate max-w-xs">
                      {selectedDevice.location.address || `${selectedDevice.location.latitude.toFixed(4)}, ${selectedDevice.location.longitude.toFixed(4)}`}
                    </p>
                  </div>
                </div>

                {selectedDevice.recoveryNotes && (
                  <div className="pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Reward / Recovery Notes</span>
                    <p className="text-slate-300 italic mt-0.5">
                      {selectedDevice.recoveryNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Security Architecture Details */}
          <div className="cyber-card p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              Lost Mode Defensive Guard Protocol
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  1. Dedicated Fullscreen Lock Activity
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The Android companion launches a foreground locked activity that hides other apps and presents the recovery banner.
                </p>
              </div>

              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. Single-Tap Emergency Dial
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The finder can tap the green button to call your authorized recovery phone number without browsing contacts or private data.
                </p>
              </div>

              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  3. Accelerating GPS Tracking
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Location polling interval speeds up to transmit fresh coordinates to your SOC dashboard continuously.
                </p>
              </div>

              <div className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  4. Tamper & PIN Shielding
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The unlock PIN is never exposed on the lost device. Only the authenticated owner in the dashboard knows it.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Live Mobile Lockscreen Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-400" />
              Phone Screen Preview
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live Mockup</span>
          </div>

          {/* Android Mobile Frame Mockup */}
          <div className="w-full max-w-[280px] mx-auto bg-[#070B14] border-4 border-slate-700 rounded-[36px] p-3 shadow-2xl relative overflow-hidden">
            
            {/* Notch */}
            <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3" />

            {/* Screen Content */}
            <div className="h-[420px] rounded-[24px] bg-[#0B1120] border border-rose-500/30 p-4 flex flex-col justify-between text-center">
              
              <div className="space-y-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    DEVICE IN LOST MODE
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">SecureLock Defense Agent</p>
                </div>

                <div className="p-3 bg-[#151E2E] border border-white/[0.08] rounded-xl text-left space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Message</span>
                  <p className="text-[11px] font-medium text-slate-200 leading-snug">
                    "{selectedDevice.lostModeMessage || 'This phone is lost. Please contact the owner.'}"
                  </p>
                  {selectedDevice.recoveryNotes && (
                    <p className="text-[9px] text-slate-400 italic pt-1 border-t border-white/[0.06]">
                      {selectedDevice.recoveryNotes}
                    </p>
                  )}
                </div>

                {selectedDevice.recoveryContact && (
                  <div className="py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-md">
                    <PhoneCall className="w-3 h-3" />
                    <span>CALL: {selectedDevice.recoveryContact}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 pt-2 border-t border-white/[0.06] text-[9px] text-slate-400">
                <p>Owner PIN Unlock Supported</p>
                <p className="font-mono text-blue-400">GPS Stream Active</p>
              </div>

            </div>

          </div>

          <div className="p-3 bg-[#151E2E] border border-white/[0.08] rounded-xl text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Privacy Safeguard:</span>
            <p className="text-slate-400 leading-relaxed">
              No private email, account identifiers, or personal photos are displayed on the phone's lost screen. Only owner-specified recovery data is shown.
            </p>
          </div>
        </div>

      </div>

      {/* Deactivate Confirmation Modal */}
      {confirmingDeactivate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151E2E] border border-white/[0.1] rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Unlock className="w-5 h-5" />
              <span>Deactivate Lost Mode?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will release the emergency screen lock and return <strong className="text-white">{selectedDevice.deviceName}</strong> to normal companion operation.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmingDeactivate(false)}
                className="cyber-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="cyber-btn-primary bg-emerald-600 hover:bg-emerald-500 text-xs font-bold"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
