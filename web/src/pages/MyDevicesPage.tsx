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
  ShieldCheck, 
  Battery, 
  Radio, 
  Info, 
  UserCheck,
  X,
  LogIn
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              FLEET TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-400">Total: {devices.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Registered Devices
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Enrolled Android devices bound to Owner Account: <strong className="text-slate-200">{user?.email || 'owner@securelock.io'}</strong>
          </p>
        </div>

        <button
          onClick={() => {
            setShowRegisterModal(true);
            setGeneratedPairingCode(null);
          }}
          className="cyber-btn-primary text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Device</span>
        </button>
      </div>

      {/* Empty State */}
      {devices.length === 0 ? (
        <div className="cyber-card p-12 text-center space-y-3">
          <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No registered devices</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Register your Android device to start protecting it with SecureLock.
          </p>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="cyber-btn-primary text-xs"
          >
            Register Device
          </button>
        </div>
      ) : (
        /* Devices Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => {
            const isSelected = device.deviceId === selectedDeviceId;
            const isOwnedByCurrent = device.ownerId === (user?.uid || 'usr-cyber-owner-01');

            return (
              <div
                key={device.deviceId}
                className={`cyber-card p-5 transition-all duration-200 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-blue-500/60 ring-1 ring-blue-500/30 bg-[#1A2537]' 
                    : 'hover:border-white/[0.15]'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
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
                  <div className="p-2.5 bg-[#0B1120] border border-white/[0.06] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 uppercase font-semibold">Bound Owner ID:</span>
                      <span className={`font-mono font-semibold ${isOwnedByCurrent ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {device.ownerId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <UserCheck className="w-3 h-3 text-blue-400" />
                      <span>{isOwnedByCurrent ? 'Authorized Under Your Active Account' : 'Authorized to Secondary Owner'}</span>
                    </div>
                  </div>

                  {/* Device Details Specs Pill */}
                  <div className="bg-[#0B1120] border border-white/[0.06] rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Battery</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Battery className={`w-3.5 h-3.5 ${device.battery.level < 20 ? 'text-rose-400' : 'text-blue-400'}`} />
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
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedDeviceId(device.deviceId);
                      onNavigate('device-details');
                    }}
                    className="cyber-btn-secondary text-xs py-1.5 px-3"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>Specs</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedDeviceId(device.deviceId);
                        onNavigate('controls');
                      }}
                      className="cyber-btn-primary text-xs py-1.5 px-3"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Control</span>
                    </button>

                    <button
                      onClick={() => setDeviceToDelete(device.deviceId)}
                      className="p-2 rounded-lg bg-[#0B1120] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
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
      )}

      {/* Enroll Device Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151E2E] border border-white/[0.1] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Enroll Another Android Device
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => setModalTab('original-id')}
                className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                  modalTab === 'original-id'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Owner Account Login (Recommended)
              </button>
              <button
                type="button"
                onClick={() => setModalTab('token')}
                className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
                  modalTab === 'token'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Manual Pairing Token
              </button>
            </div>

            {modalTab === 'original-id' ? (
              <div className="space-y-4 py-2">
                <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-blue-300">How to Control Another Android Device:</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Install the SecureLock Companion APK on the target phone, tap <strong>"Sign In With Owner Account"</strong>, and enter your exact credentials (<strong className="text-white">{user?.email}</strong>). The device will immediately bind to your dashboard.
                  </p>
                </div>

                <div className="p-3 bg-[#0B1120] border border-white/[0.06] rounded-xl text-xs space-y-2">
                  <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Test via Simulator</span>
                  <p className="text-[11px] text-slate-400">
                    You can test this linking flow right now by opening the Companion Phone Simulator:
                  </p>
                  <button
                    onClick={handleOpenCompanionLogin}
                    className="cyber-btn-primary w-full text-xs font-bold py-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Phone Simulator Login Screen</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Device Name / Nickname
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g. Work Samsung Galaxy S24"
                    className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Device Hardware Model
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeviceModel}
                    onChange={(e) => setNewDeviceModel(e.target.value)}
                    placeholder="e.g. Samsung Galaxy S24 / OnePlus 12"
                    className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {generatedPairingCode ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-center">
                    <p className="text-xs text-emerald-400 font-semibold">Device Registered! Enter Token on Android App:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-lg font-bold text-white tracking-widest bg-[#0B1120] px-4 py-1.5 rounded-lg border border-white/[0.1]">
                        {generatedPairingCode}
                      </span>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="cyber-btn-secondary text-xs py-1.5 px-2.5"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="cyber-btn-primary w-full text-xs font-bold py-2.5"
                  >
                    Register & Generate Pairing Token
                  </button>
                )}
              </form>
            )}

            <div className="flex justify-end pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="cyber-btn-secondary text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deviceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151E2E] border border-rose-500/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Trash2 className="w-5 h-5" />
              <span>Unenroll Device?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will revoke owner remote defense policies for device ID <span className="font-mono text-white">{deviceToDelete}</span> and disconnect Firestore sync.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeviceToDelete(null)}
                className="cyber-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deviceToDelete)}
                className="cyber-btn-danger text-xs font-bold"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
