import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { TerminalLog } from '../components/common/TerminalLog';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Lock, 
  MapPin, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Activity,
  Terminal,
  Zap
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const RemoteControlsPage: React.FC<Props> = ({ onNavigate }) => {
  const { 
    selectedDevice, 
    commands, 
    terminalLogs,
    requestLocation, 
    triggerAlarm, 
    stopAlarm, 
    triggerRemoteLock, 
    refreshDeviceStatus 
  } = useDevices();

  const [commandLoading, setCommandLoading] = useState<string | null>(null);

  if (!selectedDevice) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a device to dispatch remote commands.
      </div>
    );
  }

  const handleAction = async (actionKey: string, fn: () => Promise<any>) => {
    setCommandLoading(actionKey);
    try {
      await fn();
    } finally {
      setTimeout(() => setCommandLoading(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>REMOTE SECURITY COMMAND DISPATCH</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch cryptographically signed commands directly to the Android Companion daemon on <strong className="text-white">{selectedDevice.deviceName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
            Channel: TLS 1.3 + FCM High-Priority
          </span>
        </div>
      </div>

      {/* Control Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. High-Accuracy Location Ping */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-blue-300 border border-slate-800">
                REQUEST_LOCATION
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Request High-Accuracy Location</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Commands Android companion to query the device's Fused Location Provider at maximum accuracy and stream telemetry to Firestore.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('loc', () => requestLocation(selectedDevice.deviceId))}
            disabled={commandLoading === 'loc'}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-950/40 transition-all disabled:opacity-50"
          >
            <Radio className={`w-4 h-4 ${commandLoading === 'loc' ? 'animate-spin' : ''}`} />
            <span>{commandLoading === 'loc' ? 'Dispatching Ping...' : 'Dispatch Location Ping'}</span>
          </button>
        </div>

        {/* 2. Remote Siren Alarm */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-rose-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                selectedDevice.alarmActive 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-rose-300 border border-slate-800">
                RING_ALARM
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Remote Security Siren</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Overrides Android silent and 'Do Not Disturb' profiles to play a piercing high-decibel alarm through the phone's primary speaker.
              </p>
            </div>
          </div>

          {selectedDevice.alarmActive ? (
            <button
              onClick={() => handleAction('stop_alarm', () => stopAlarm(selectedDevice.deviceId))}
              disabled={commandLoading === 'stop_alarm'}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-rose-500/50 animate-pulse"
            >
              <VolumeX className="w-4 h-4" />
              <span>Silence Siren Alarm</span>
            </button>
          ) : (
            <button
              onClick={() => handleAction('alarm', () => triggerAlarm(selectedDevice.deviceId))}
              disabled={commandLoading === 'alarm'}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>Trigger Siren Alarm</span>
            </button>
          )}
        </div>

        {/* 3. Remote Lock (Device Admin API) */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-amber-300 border border-slate-800">
                REMOTE_LOCK
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Instant Remote Lock</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Invokes Android Device Administration API <code className="text-blue-300">DevicePolicyManager.lockNow()</code> to instantly lock the display screen.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('lock', () => triggerRemoteLock(selectedDevice.deviceId))}
            disabled={commandLoading === 'lock'}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Screen Now</span>
          </button>
        </div>

        {/* 4. Lost Mode Gateway */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-indigo-300 border border-slate-800">
                ACTIVATE_LOST_MODE
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Lost Mode Management</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Locks companion app in fullscreen, displays owner custom message, presents emergency dialer, and logs unauthorized interactions.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lost-mode')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 hover:border-blue-500"
          >
            <span>Open Lost Mode Console</span>
          </button>
        </div>

        {/* 5. Diagnostic Poll */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                STATUS_CHECK
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Poll Sensor Diagnostics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Requests immediate battery levels, network interface state, and Android security patch verification from the background service.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('status', () => refreshDeviceStatus(selectedDevice.deviceId))}
            disabled={commandLoading === 'status'}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${commandLoading === 'status' ? 'animate-spin' : ''}`} />
            <span>Poll Diagnostics</span>
          </button>
        </div>

        {/* 6. Custom Lost Message Editor Shortcut */}
        <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded text-cyan-300 border border-slate-800">
                MESSAGE_WYSIWYG
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Recovery Banner</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Customize the lost phone's emergency headline, reward promise, owner phone number, and unlock security PIN.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lost-message')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-500"
          >
            <span>Edit Custom Message</span>
          </button>
        </div>

      </div>

      {/* Terminal Audit Log */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>Cryptographic Command Log & Handshake</span>
        </h3>
        <TerminalLog logs={terminalLogs} />
      </div>

    </div>
  );
};
