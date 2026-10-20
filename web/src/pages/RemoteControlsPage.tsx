import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { TerminalLog } from '../components/common/TerminalLog';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  Lock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  AlertTriangle
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
    triggerRemoteLock 
  } = useDevices();

  const [commandLoading, setCommandLoading] = useState<string | null>(null);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-400 space-y-3">
        <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No device selected</h3>
        <p className="text-xs text-slate-400">Please select an Android device to dispatch remote security commands.</p>
        <button
          onClick={() => onNavigate('devices')}
          className="cyber-btn-primary text-xs"
        >
          View Devices
        </button>
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              COMMAND EXECUTION PIPELINE
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Remote Security Controls
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your registered device securely.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 bg-[#151E2E] px-3 py-1.5 rounded-xl border border-white/[0.08]">
            Channel: TLS 1.3 • FCM High Priority
          </span>
        </div>
      </div>

      {/* Control Grid Cards: 4 Primary Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Primary Action: Locate Device */}
        <div className="cyber-card p-5 space-y-4 flex flex-col justify-between hover:border-blue-500/40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-[#0B1120] px-2 py-0.5 rounded text-blue-300 border border-white/[0.06]">
                PRIMARY ACTION
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Locate Device</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Commands Android companion to query the device's Fused Location Provider at maximum accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('loc', () => requestLocation(selectedDevice.deviceId))}
            disabled={commandLoading === 'loc'}
            className="cyber-btn-primary w-full text-xs font-bold py-2.5"
          >
            <Radio className={`w-3.5 h-3.5 ${commandLoading === 'loc' ? 'animate-spin' : ''}`} />
            <span>{commandLoading === 'loc' ? 'Dispatching...' : 'Locate Device'}</span>
          </button>
        </div>

        {/* 2. Warning/Danger Action: Trigger Alarm */}
        <div className="cyber-card p-5 space-y-4 flex flex-col justify-between hover:border-rose-500/40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedDevice.alarmActive 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
              }`}>
                {selectedDevice.alarmActive ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <span className="text-[10px] font-mono bg-[#0B1120] px-2 py-0.5 rounded text-rose-300 border border-white/[0.06]">
                {selectedDevice.alarmActive ? 'SIREN ACTIVE' : 'EMERGENCY AUDIO'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {selectedDevice.alarmActive ? 'Mute Alarm' : 'Trigger Alarm'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {selectedDevice.alarmActive 
                  ? 'Alarm is currently blaring at max volume. Click to silence siren immediately.'
                  : 'Forces device audio stream to max volume and sounds loud continuous siren.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedDevice.alarmActive) {
                handleAction('alarm', () => stopAlarm(selectedDevice.deviceId));
              } else {
                handleAction('alarm', () => triggerAlarm(selectedDevice.deviceId));
              }
            }}
            disabled={commandLoading === 'alarm'}
            className={`w-full text-xs font-bold py-2.5 rounded-xl border transition-all inline-flex items-center justify-center gap-2 ${
              selectedDevice.alarmActive
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                : 'cyber-btn-danger'
            }`}
          >
            {selectedDevice.alarmActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{commandLoading === 'alarm' ? 'Processing...' : selectedDevice.alarmActive ? 'Mute Siren' : 'Trigger Alarm'}</span>
          </button>
        </div>

        {/* 3. Dedicated Security Action: Lost Mode */}
        <div className="cyber-card p-5 space-y-4 flex flex-col justify-between hover:border-blue-500/40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedDevice.lostMode
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-[#0B1120] px-2 py-0.5 rounded text-slate-300 border border-white/[0.06]">
                {selectedDevice.lostMode ? 'ENGAGED' : 'RECOVERY LOCK'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Lost Mode</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Launches fullscreen lock activity displaying your custom message and emergency owner phone number.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('lost-mode')}
            className="cyber-btn-secondary w-full text-xs font-semibold py-2.5"
          >
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>{selectedDevice.lostMode ? 'Manage Lost Mode' : 'Configure Lost Mode'}</span>
          </button>
        </div>

        {/* 4. Warning Action: Lock Device */}
        <div className="cyber-card p-5 space-y-4 flex flex-col justify-between hover:border-amber-500/40">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-[#0B1120] px-2 py-0.5 rounded text-amber-300 border border-white/[0.06]">
                DEVICE ADMIN
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Lock Device</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Invokes DevicePolicyManager lockNow() API to turn off screen and require phone lockscreen credentials.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleAction('lock', () => triggerRemoteLock(selectedDevice.deviceId))}
            disabled={commandLoading === 'lock'}
            className="cyber-btn-secondary border-amber-500/30 text-amber-300 hover:bg-amber-500/10 w-full text-xs font-semibold py-2.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{commandLoading === 'lock' ? 'Locking...' : 'Lock Device'}</span>
          </button>
        </div>

      </div>

      {/* Audit Logs & Command History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Terminal Log */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-400" />
            Direct Daemon Output Log
          </h3>
          <TerminalLog logs={terminalLogs} />
        </div>

        {/* Dispatch History Table */}
        <div className="cyber-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Dispatched Commands
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total: {commands.length}</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {commands.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                No commands dispatched in this session yet.
              </div>
            ) : (
              commands.slice(0, 8).map((cmd) => (
                <div 
                  key={cmd.commandId}
                  className="p-3 bg-[#1A2537] border border-white/[0.06] rounded-xl text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="font-mono font-bold text-white text-[11px]">{cmd.type}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {cmd.commandId.slice(0, 10)}... • {new Date(cmd.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      cmd.status === 'EXECUTED' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : cmd.status === 'FAILED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {cmd.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
