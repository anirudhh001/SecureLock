import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Smartphone, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Battery, 
  Radio, 
  Info, 
  Lock,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const MyDevicesPage: React.FC<Props> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId, 
    registerDevice, 
    removeDevice,
    setCompanionMode,
    isSimulatorOpen,
    toggleSimulator
  } = useDevices();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('Google Pixel 8 Pro');
  const [generatedPairingCode, setGeneratedPairingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName) return;

    const res = await registerDevice(newDeviceName, newDeviceModel);
    if (res.success) {
      setGeneratedPairingCode(`PAIR-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setNewDeviceName('');
    }
  };

  const copyCode = () => {
    if (generatedPairingCode) {
      navigator.clipboard.writeText(generatedPairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const confirmDelete = async (deviceId: string) => {
    await removeDevice(deviceId);
    setDeviceToDelete(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Devices
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage and inspect enrolled Android devices under active protection.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedPairingCode(null);
            setShowRegisterModal(true);
          }}
          className="cyber-btn-primary text-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Device</span>
        </button>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((device) => {
          const isSelected = selectedDeviceId === device.deviceId;

          return (
            <div 
              key={device.deviceId}
              className={`cyber-card p-6 flex flex-col justify-between space-y-4 transition-all ${
                isSelected 
                  ? 'border-blue-500/50 ring-1 ring-blue-500/20' 
                  : 'hover:border-slate-300 dark:hover:border-white/[0.15]'
              }`}
            >
              <div className="space-y-4">
                
                {/* Top: Icon + Name + Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                        {device.deviceName}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {device.specs.model}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={device.status} size="sm" />
                </div>

                {/* Specs / Attributes */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">Battery</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {device.battery.level}% {device.battery.isCharging ? '• Charging' : ''}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">Lost Mode</span>
                    <span className={`font-medium ${device.lostMode ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                      {device.lostMode ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">Device ID</span>
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate block">
                      {device.deviceId.slice(0, 4)}••••{device.deviceId.slice(-4)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block">Enrolled</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(device.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedDeviceId(device.deviceId);
                    onNavigate('device-details');
                  }}
                  className="cyber-btn-secondary text-xs flex-1 flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>View Details</span>
                </button>

                {devices.length > 1 && (
                  <button
                    onClick={() => setDeviceToDelete(device.deviceId)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="Remove device"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Device Modal */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141D2E] rounded-xl border border-slate-200 dark:border-white/[0.1] max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Remove Device?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove this device? Security telemetry will stop transmitting.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeviceToDelete(null)}
                className="cyber-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deviceToDelete)}
                className="cyber-btn-danger text-xs"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Device Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#141D2E] rounded-xl border border-slate-200 dark:border-white/[0.1] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Register New Android Device
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {generatedPairingCode ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-center space-y-1.5">
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Device Pairing Token</span>
                  <p className="text-xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">{generatedPairingCode}</p>
                </div>
                <button
                  onClick={copyCode}
                  className="w-full cyber-btn-secondary text-xs flex items-center justify-center gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Token'}</span>
                </button>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full cyber-btn-primary text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g. Work Samsung Galaxy S24"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hardware Model
                  </label>
                  <input
                    type="text"
                    value={newDeviceModel}
                    onChange={(e) => setNewDeviceModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="cyber-btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cyber-btn-primary text-xs"
                  >
                    Generate Pairing Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
