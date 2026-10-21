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
  Smartphone,
  AlertTriangle,
  ArrowRight
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
  const [confirmModal, setConfirmModal] = useState<{ action: string; title: string; desc: string; onConfirm: () => void } | null>(null);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
        <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No device selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select an Android device to dispatch remote security commands.</p>
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
      setTimeout(() => setCommandLoading(null), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Target: {selectedDevice.deviceName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Remote Security Controls
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your registered device.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#141D2E] border border-slate-200 dark:border-white/[0.08]">
            Channel: TLS 1.3
          </span>
        </div>
      </div>

      {/* Control Grid: 4 Essential Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Locate Device */}
        <div className="cyber-card p-5 flex flex-col justify-between space-y-4 hover:border-blue-500/40">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Locate Device</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Query real-time GPS coordinates via Google Play Services.
              </p>
            </div>
          </div>
          <button
            disabled={commandLoading === 'locate'}
            onClick={() => handleAction('locate', () => requestLocation(selectedDevice.deviceId))}
            className="w-full cyber-btn-primary text-xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{commandLoading === 'locate' ? 'Querying...' : 'Locate Device'}</span>
          </button>
        </div>

        {/* 2. Alarm Control */}
        <div className={`cyber-card p-5 flex flex-col justify-between space-y-4 ${
          selectedDevice.alarmActive ? 'border-amber-300 dark:border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10' : ''
        }`}>
          <div className="space-y-2.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedDevice.alarmActive 
                ? 'bg-amber-500 text-white' 
                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {selectedDevice.alarmActive ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedDevice.alarmActive ? 'Siren Ringing' : 'Trigger Alarm'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedDevice.alarmActive ? 'Device is playing high-decibel alert.' : 'Sounds siren at max volume even on silent.'}
              </p>
            </div>
          </div>
          {selectedDevice.alarmActive ? (
            <button
              disabled={commandLoading === 'alarm'}
              onClick={() => handleAction('alarm', () => stopAlarm(selectedDevice.deviceId))}
              className="w-full cyber-btn-secondary text-xs text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Alarm</span>
            </button>
          ) : (
            <button
              disabled={commandLoading === 'alarm'}
              onClick={() => handleAction('alarm', () => triggerAlarm(selectedDevice.deviceId))}
              className="w-full cyber-btn-secondary text-xs hover:border-amber-400"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{commandLoading === 'alarm' ? 'Triggering...' : 'Trigger Alarm'}</span>
            </button>
          )}
        </div>

        {/* 3. Lost Mode */}
        <div className={`cyber-card p-5 flex flex-col justify-between space-y-4 ${
          selectedDevice.lostMode ? 'border-rose-300 dark:border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/10' : ''
        }`}>
          <div className="space-y-2.5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedDevice.lostMode 
                ? 'bg-rose-500 text-white' 
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lost Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedDevice.lostMode ? 'Active on phone screen.' : 'Lock phone and broadcast contact notice.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('lost-mode')}
            className={`w-full text-xs font-medium py-2 px-3 rounded-lg border transition-colors ${
              selectedDevice.lostMode 
                ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-500/40' 
                : 'cyber-btn-secondary'
            }`}
          >
            <span>{selectedDevice.lostMode ? 'Manage Lost Mode' : 'Configure Lost Mode'}</span>
          </button>
        </div>

        {/* 4. Lock Device */}
        <div className="cyber-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lock Device</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instantly locks screen using Android Device Policy Manager.
              </p>
            </div>
          </div>
          <button
            disabled={commandLoading === 'lock'}
            onClick={() => setConfirmModal({
              action: 'lock',
              title: 'Lock Android Device?',
              desc: 'This will lock the device screen immediately. It can be unlocked with the device PIN.',
              onConfirm: () => handleAction('lock', () => triggerRemoteLock(selectedDevice.deviceId)),
            })}
            className="w-full cyber-btn-secondary text-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{commandLoading === 'lock' ? 'Locking...' : 'Lock Device'}</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141D2E] rounded-xl border border-slate-200 dark:border-white/[0.1] max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {confirmModal.desc}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="cyber-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="cyber-btn-primary text-xs"
              >
                Confirm Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Audit Log */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Command Execution Audit Trail
        </h3>
        <TerminalLog logs={terminalLogs} />
      </div>

    </div>
  );
};
