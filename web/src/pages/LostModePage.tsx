import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  Lock, 
  Unlock, 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  MessageSquareWarning, 
  CheckCircle2, 
  Info, 
  Smartphone,
  Eye,
  Edit3,
  Volume2
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const LostModePage: React.FC<Props> = ({ onNavigate }) => {
  const { 
    selectedDevice, 
    activateLostMode, 
    deactivateLostMode,
    triggerAlarm 
  } = useDevices();

  const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a device to configure Lost Mode.
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
      selectedDevice.lostModeMessage || 'THIS PHONE IS REPORTED LOST. Please return to the owner immediately.',
      selectedDevice.recoveryContact || '+1 (555) 019-2834',
      selectedDevice.recoveryNotes || 'Cash reward provided upon safe return.',
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
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isLost 
                ? 'bg-rose-500/20 border border-rose-500 text-rose-300 cyber-glow-danger animate-pulse' 
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              {isLost ? '⚠️ LOST MODE ACTIVE' : '● DEVICE SECURED'}
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            LOST MODE DEFENSE CONSOLE
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Emergency lockdown, recovery message broadcast, and application-level protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('lost-message')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Message & Contact</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Status, Actions & Phone Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Lost Mode State & Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Status Card */}
          <div className={`rounded-2xl p-6 border shadow-2xl transition-all ${
            isLost 
              ? 'bg-rose-950/20 border-rose-500/60 cyber-glow-danger' 
              : 'bg-cyber-900/90 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isLost 
                    ? 'bg-rose-500/20 border border-rose-500 text-rose-400 animate-pulse' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isLost ? 'Lost Mode is Currently Active' : 'Lost Mode is Disarmed'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isLost 
                      ? 'The companion app has locked the phone screen with your customized recovery banner.' 
                      : 'The Android device is running normally under standard background guard.'}
                  </p>
                </div>
              </div>

              {/* State Action Buttons */}
              {isLost ? (
                <button
                  onClick={() => setConfirmingDeactivate(true)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all self-start sm:self-auto"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Deactivate Lost Mode</span>
                </button>
              ) : (
                <button
                  onClick={handleQuickActivate}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all self-start sm:self-auto"
                >
                  <Lock className="w-4 h-4" />
                  <span>Engage Lost Mode Now</span>
                </button>
              )}
            </div>

            {/* Current Broadcast Content Preview */}
            <div className="mt-5 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareWarning className="w-4 h-4 text-cyan-400" />
                Broadcasted Recovery Data on Phone
              </span>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Custom Message</span>
                  <p className="text-white font-medium mt-0.5 text-sm">
                    "{selectedDevice.lostModeMessage || 'This phone is lost. Please contact the owner.'}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Emergency Dialing Contact</span>
                    <p className="font-mono text-cyan-300 font-bold mt-0.5">
                      {selectedDevice.recoveryContact || 'None Configured'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Local Deactivation PIN</span>
                    <p className="font-mono text-emerald-400 font-bold mt-0.5">
                      {selectedDevice.devicePin || '1234'}
                    </p>
                  </div>
                </div>

                {selectedDevice.recoveryNotes && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Instructions / Reward Note</span>
                    <p className="text-slate-300 italic mt-0.5">
                      {selectedDevice.recoveryNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Android Protections Breakdown */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              What Happens When Lost Mode Is Engaged?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  1. Fullscreen Recovery Screen
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The Android companion launches a fullscreen top-level activity locking UI focus, rendering your personalized message and contact number.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. Single-Tap Owner Dialer
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The person who finds the phone can tap the emergency button to call only your specified recovery contact without accessing personal contacts or apps.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  3. Accelerated GPS Stream
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Location polling interval automatically accelerates to stream high-accuracy breadcrumbs to the web dashboard.
                </p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  4. Tamper & PIN Logging
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Incorrect local PIN unlock attempts or SIM eject triggers immediate Critical security alerts visible in the Security Center.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Live Mobile Lockscreen Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Phone Screen Preview
            </span>
            <span className="text-[10px] text-slate-400">Live Mockup</span>
          </div>

          {/* Android Mobile Frame Mockup */}
          <div className="w-full max-w-[280px] mx-auto bg-slate-950 border-4 border-slate-800 rounded-[36px] p-3 shadow-2xl relative overflow-hidden">
            
            {/* Notch */}
            <div className="w-16 h-3 bg-slate-900 rounded-full mx-auto mb-3"></div>

            {/* Screen Content */}
            <div className="h-[420px] rounded-[24px] bg-gradient-to-b from-slate-950 via-rose-950/40 to-slate-950 p-4 flex flex-col justify-between text-center border border-rose-500/20">
              
              <div className="space-y-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider">
                    DEVICE IN LOST MODE
                  </h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">SecureLock Defense Agent</p>
                </div>

                <div className="p-2.5 bg-slate-900/90 border border-rose-500/30 rounded-xl text-left space-y-1">
                  <span className="text-[9px] font-bold text-rose-400 uppercase">Message</span>
                  <p className="text-[11px] font-medium text-slate-200 leading-snug">
                    "{selectedDevice.lostModeMessage || 'This phone is lost. Please call owner.'}"
                  </p>
                  {selectedDevice.recoveryNotes && (
                    <p className="text-[9px] text-slate-400 italic pt-1 border-t border-slate-800">
                      {selectedDevice.recoveryNotes}
                    </p>
                  )}
                </div>

                {selectedDevice.recoveryContact && (
                  <div className="py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-lg">
                    <PhoneCall className="w-3 h-3" />
                    <span>CALL: {selectedDevice.recoveryContact}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-900 text-[9px] text-slate-400">
                <p>Owner PIN Unlock Supported</p>
                <p className="font-mono text-cyan-400">GPS Stream Active</p>
              </div>

            </div>

          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">Privacy Safeguard:</span>
            <p className="text-slate-400 leading-relaxed">
              No private email, account identifiers, or personal media are displayed on the phone's lost screen. Only owner-specified recovery data is shown.
            </p>
          </div>
        </div>

      </div>

      {/* Deactivate Confirmation Modal */}
      {confirmingDeactivate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Unlock className="w-5 h-5" />
              <span>Deactivate Lost Mode?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will release the emergency screen lock and return <strong className="text-white">{selectedDevice.deviceName}</strong> to normal companion operation.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmingDeactivate(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
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
