import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryCharging, 
  ShieldCheck, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Key, 
  Plane, 
  Cpu, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Radio,
  Sliders
} from 'lucide-react';

export const AndroidDeviceSimulator: React.FC = () => {
  const { 
    selectedDevice, 
    isSimulatorOpen, 
    toggleSimulator,
    stopAlarm,
    simulatorUnlockWithPin,
    simulatorToggleAirplaneMode,
    simulatorTriggerSimRemoval,
    simulatorUpdateBattery
  } = useDevices();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);

  if (!isSimulatorOpen || !selectedDevice) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = simulatorUnlockWithPin(enteredPin);
    if (!success) {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    } else {
      setEnteredPin('');
      setPinError(false);
    }
  };

  const isAirplane = selectedDevice.network.type === 'NONE';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Phone Mockup Frame */}
      <div className="w-[320px] bg-slate-900 border-4 border-slate-700/80 rounded-[42px] shadow-2xl overflow-hidden relative transition-all duration-300 ring-1 ring-cyan-500/20">
        
        {/* Physical Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
        </div>

        {/* Top Control Bar (Web Simulator Header) */}
        <div className="bg-slate-950 px-4 pt-2 pb-1.5 flex items-center justify-between border-b border-slate-800/60 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-cyan-300 tracking-wider">ANDROID COMPANION SIM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setShowControlsDrawer(!showControlsDrawer)}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Simulator Sensor Controls"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={toggleSimulator}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-rose-400"
              title="Close Simulator"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Simulator Hardware Sensors Drawer */}
        {showControlsDrawer && (
          <div className="bg-slate-950/95 border-b border-slate-800 p-3 text-xs space-y-2 z-30">
            <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px]">
              <span>Hardware Sensor Injections</span>
              <span className="text-[10px] text-cyan-400">Owner Testing</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={simulatorToggleAirplaneMode}
                className={`px-2 py-1.5 rounded text-[10px] font-medium border flex items-center justify-center gap-1 ${
                  isAirplane 
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Plane className="w-3 h-3" />
                {isAirplane ? 'Airplane ON' : 'Toggle Airplane'}
              </button>

              <button
                onClick={simulatorTriggerSimRemoval}
                className="px-2 py-1.5 rounded text-[10px] font-medium bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 flex items-center justify-center gap-1"
              >
                <Cpu className="w-3 h-3" />
                Simulate SIM Eject
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span>Battery: {selectedDevice.battery.level}%</span>
              <div className="flex gap-1">
                <button
                  onClick={() => simulatorUpdateBattery(12, false)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Low (12%)
                </button>
                <button
                  onClick={() => simulatorUpdateBattery(85, false)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  85%
                </button>
                <button
                  onClick={() => simulatorUpdateBattery(100, true)}
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400"
                >
                  Charging
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phone Screen Area */}
        <div className={`h-[520px] flex flex-col justify-between transition-colors duration-300 ${
          selectedDevice.alarmActive 
            ? 'bg-gradient-to-b from-rose-950 via-red-900 to-black animate-pulse' 
            : selectedDevice.lostMode 
              ? 'bg-gradient-to-b from-slate-950 via-red-950/40 to-slate-950' 
              : 'bg-gradient-to-b from-[#0a0f1d] to-[#040711]'
        }`}>

          {/* Android System Status Bar */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex items-center gap-2">
              {isAirplane ? (
                <Plane className="w-3.5 h-3.5 text-amber-400" />
              ) : selectedDevice.network.type === 'WIFI' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] font-bold text-cyan-400">5G</span>
              )}

              <div className="flex items-center gap-1">
                <span>{selectedDevice.battery.level}%</span>
                {selectedDevice.battery.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ) : (
                  <Battery className={`w-3.5 h-3.5 ${selectedDevice.battery.level < 20 ? 'text-rose-400' : 'text-slate-300'}`} />
                )}
              </div>
            </div>
          </div>

          {/* SCREEN CONTENT: 1. ALARM STROBE ACTIVE */}
          {selectedDevice.alarmActive ? (
            <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-bounce">
                <Volume2 className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>

              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-rose-500 text-white font-black text-xs tracking-wider animate-pulse">
                  SECURITY SIREN TRIGGERED
                </span>
                <h4 className="text-white font-bold text-lg mt-2">EMERGENCY ALARM</h4>
                <p className="text-xs text-rose-200 mt-1">
                  Owner has remotely sounded the security siren at 100% volume override.
                </p>
              </div>

              <button
                onClick={() => stopAlarm(selectedDevice.deviceId)}
                className="w-full py-2.5 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-slate-200 shadow-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <VolumeX className="w-4 h-4 text-rose-600" />
                MUTE SIREN
              </button>
            </div>
          ) : selectedDevice.lostMode ? (

            /* SCREEN CONTENT: 2. FULL LOST MODE EMERGENCY SCREEN */
            <div className="px-5 py-3 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3 pt-2">
                {/* Emergency Lock Header */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 mb-1">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-black tracking-wide text-rose-400 uppercase">
                    DEVICE IN LOST MODE
                  </h3>
                  <div className="inline-block px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-[10px] text-rose-300">
                    PROTECTED BY SECURELOCK
                  </div>
                </div>

                {/* Custom Owner Recovery Message Card */}
                <div className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-3.5 space-y-2 shadow-lg">
                  <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Message from Owner
                  </div>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    "{selectedDevice.lostModeMessage || 'This phone has been lost. Please return to owner.'}"
                  </p>
                  {selectedDevice.recoveryNotes && (
                    <p className="text-[11px] text-slate-400 italic border-t border-slate-800 pt-1.5">
                      {selectedDevice.recoveryNotes}
                    </p>
                  )}
                </div>

                {/* Emergency Phone Dialer Button */}
                {selectedDevice.recoveryContact && (
                  <div className="space-y-1">
                    <a
                      href={`tel:${selectedDevice.recoveryContact}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <PhoneCall className="w-4 h-4 text-slate-950" />
                      CALL OWNER: {selectedDevice.recoveryContact}
                    </a>
                    <p className="text-[9px] text-center text-slate-400">
                      Emergency dialer allows calling only this verified contact.
                    </p>
                  </div>
                )}
              </div>

              {/* Local PIN Unlock Form for testing */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Key className="w-3 h-3 text-cyan-400" />
                    Owner PIN Unlock
                  </span>
                  <span className="text-slate-400">PIN: {selectedDevice.devicePin || '1234'}</span>
                </div>
                <form onSubmit={handlePinSubmit} className="flex gap-1.5">
                  <input
                    type="password"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    placeholder="Enter PIN"
                    className={`flex-1 bg-slate-900 border rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      pinError 
                        ? 'border-rose-500 focus:ring-rose-500 animate-shake' 
                        : 'border-slate-700 focus:ring-cyan-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Unlock
                  </button>
                </form>
                {pinError && (
                  <p className="text-[9px] text-rose-400 mt-1 font-medium">
                    Invalid PIN. Unauthorized unlock logged to Security Center!
                  </p>
                )}
              </div>

            </div>
          ) : (

            /* SCREEN CONTENT: 3. NORMAL COMPANION APP HOME */
            <div className="px-5 py-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-none">SecureLock Agent</h4>
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                        Active & Guarded
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                    v2.4-arm64
                  </span>
                </div>

                {/* Device Status Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Device Name:</span>
                    <span className="font-semibold text-slate-200">{selectedDevice.deviceName.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Device Admin:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ENABLED
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">GPS Tracking:</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" /> HIGH ACCURACY
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                    <span className="text-slate-400 text-[11px]">Current Lock PIN:</span>
                    <span className="font-mono text-cyan-300 font-bold">{selectedDevice.devicePin || '1234'}</span>
                  </div>
                </div>

                {/* Companion Telemetry info */}
                <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 text-[11px] space-y-1">
                  <div className="text-cyan-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Legitimate Owner Control
                  </div>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Companion service running in foreground with persistent notification per Android 14 requirements.
                  </p>
                </div>
              </div>

              {/* Bottom Navigation Simulator Pill */}
              <div className="py-2 text-center border-t border-slate-800/50">
                <span className="text-[9px] text-slate-400 font-mono">
                  Device ID: {selectedDevice.deviceId}
                </span>
              </div>
            </div>
          )}

          {/* Android Bottom Soft Navigation Bar */}
          <div className="h-6 bg-slate-950 flex items-center justify-center gap-8 text-slate-600">
            <span className="w-3 h-3 rounded-full border border-slate-700"></span>
            <span className="w-8 h-1 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rotate-45 border-l border-b border-slate-700"></span>
          </div>

        </div>

      </div>

      {/* Floating Indicator when Simulator is Open */}
      <div className="mt-2 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Companion Live Synced: <strong className="text-white">{selectedDevice.deviceName.split(' ')[0]}</strong></span>
      </div>
    </div>
  );
};
