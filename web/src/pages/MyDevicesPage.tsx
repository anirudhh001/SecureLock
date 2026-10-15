import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Smartphone, 
  Plus, 
  Trash2, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Battery, 
  AlertTriangle,
  Radio,
  Info,
  LogIn,
  Key,
  UserCheck
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
  const [modalTab, setModalTab] = useState<'original-id' | 'token'>('original-id');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('Google Pixel 8');
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

  const handleOpenCompanionLogin = () => {
    setCompanionMode('login');
    if (!isSimulatorOpen) toggleSimulator();
    setShowRegisterModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>MY REGISTERED HARDWARE</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {devices.length} Devices
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enrolled Android devices bound to Owner Account: <strong className="text-cyan-300">{user?.email || 'owner@securelock.io'}</strong> (UID: <span className="font-mono text-slate-300">{user?.uid || 'usr-cyber-owner-01'}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowRegisterModal(true);
              setGeneratedPairingCode(null);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Device</span>
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isSelected = device.deviceId === selectedDeviceId;
          const isOwnedByCurrent = device.ownerId === (user?.uid || 'usr-cyber-owner-01');

          return (
            <div
              key={device.deviceId}
              className={`bg-cyber-900/90 border rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between ${
                isSelected 
                  ? 'border-cyan-500/60 ring-1 ring-cyan-500/30 cyber-glow' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-snug">{device.deviceName}</h3>
                      <p className="text-[11px] text-slate-400">{device.specs.model}</p>
                    </div>
                  </div>

                  <StatusBadge status={device.status} size="sm" />
                </div>

                {/* Ownership ID Verification Badge */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 uppercase font-semibold">Bound Owner ID:</span>
                    <span className={`font-mono font-semibold ${isOwnedByCurrent ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {device.ownerId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    <span>{isOwnedByCurrent ? 'Authorized Under Your Active Account' : 'Authorized to Secondary Owner'}</span>
                  </div>
                </div>

                {/* Device Details Specs Pill */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Battery</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Battery className={`w-3.5 h-3.5 ${device.battery.level < 20 ? 'text-rose-400' : 'text-cyan-400'}`} />
                      <span className="font-bold text-slate-200">{device.battery.level}%</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">OS Version</span>
                    <p className="font-medium text-slate-200 mt-0.5">{device.specs.osVersion.split(' ')[0]}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Admin Policy</span>
                    <p className="font-medium text-emerald-400 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> ACTIVE
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">Lost Mode</span>
                    <p className={`font-semibold mt-0.5 ${device.lostMode ? 'text-rose-400' : 'text-slate-400'}`}>
                      {device.lostMode ? 'ACTIVATED' : 'DISARMED'}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>ID: {device.deviceId}</span>
                  <span>Seen: {new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedDeviceId(device.deviceId);
                    onNavigate('device-details');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Specs</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      onNavigate('controls');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-xs text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Control</span>
                  </button>

                  <button
                    onClick={() => setDeviceToDelete(device.deviceId)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800 text-slate-400 hover:text-rose-400"
                    title="Unenroll Device"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Enroll Device Modal with Original ID Login */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Enroll Another Android Device
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Method Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setModalTab('original-id')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  modalTab === 'original-id'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Method 1: Original Account Login</span>
              </button>

              <button
                onClick={() => setModalTab('token')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  modalTab === 'token'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Method 2: One-Time Token</span>
              </button>
            </div>

            {modalTab === 'original-id' ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Your Master Owner Identity</span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-white">{user?.email || 'owner@securelock.io'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Owner UID:</span>
                    <span className="font-mono text-cyan-300">{user?.uid || 'usr-cyber-owner-01'}</span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-xl text-slate-300 space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-cyan-300">How to Link Physical Android Phone:</p>
                  <ol className="list-decimal list-inside text-[11px] text-slate-400 space-y-1">
                    <li>Install <strong>SecureLock Companion</strong> on the other Android phone.</li>
                    <li>On the phone setup screen, enter your original account email (<strong className="text-white">{user?.email || 'owner@securelock.io'}</strong>) and master password.</li>
                    <li>Approve Device Administrator privileges when prompted.</li>
                    <li>The phone is immediately bound to your owner account and controllable from this console.</li>
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCompanionLogin}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch Login in Companion Phone Simulator</span>
                </button>
              </div>
            ) : (
              !generatedPairingCode ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Device Nickname
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      placeholder="e.g. Pixel 8 - Personal"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hardware Model
                    </label>
                    <select
                      value={newDeviceModel}
                      onChange={(e) => setNewDeviceModel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Google Pixel 8">Google Pixel 8 (Android 14)</option>
                      <option value="Samsung Galaxy S24">Samsung Galaxy S24 (Android 14)</option>
                      <option value="OnePlus 12">OnePlus 12 (Android 14)</option>
                      <option value="Motorola Edge 50">Motorola Edge 50 (Android 14)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                      className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
                    >
                      Generate One-Time Code
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4 text-xs">
                  <div className="p-4 bg-white rounded-xl inline-block shadow-lg mx-auto">
                    <QrCode className="w-28 h-28 text-slate-950" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-400">One-Time Pairing Code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-base font-mono font-bold text-cyan-300 tracking-wider">
                        {generatedPairingCode}
                      </span>
                      <button
                        onClick={copyCode}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              )
            )}

          </div>
        </div>
      )}

      {/* Confirm Deletion Guard Modal */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Unenroll Device?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove this device? Remote monitoring, Lost Mode controls, and alarm triggers will be severed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeviceToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deviceToDelete)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Unenroll
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
