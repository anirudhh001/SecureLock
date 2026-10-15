import React, { useState } from 'react';
import { useDevices } from '../../context/DeviceContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Smartphone, 
  Wifi, 
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
  Radio,
  Sliders,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  Lock
} from 'lucide-react';

export const AndroidDeviceSimulator: React.FC = () => {
  const { user } = useAuth();
  const { 
    selectedDevice, 
    isSimulatorOpen, 
    toggleSimulator,
    stopAlarm,
    simulatorUnlockWithPin,
    simulatorToggleAirplaneMode,
    simulatorTriggerSimRemoval,
    simulatorUpdateBattery,
    companionMode,
    setCompanionMode,
    enrollDeviceViaOriginalId,
    testUnauthorizedAttackAttempt
  } = useDevices();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);

  // Companion Login Form State
  const [enrollEmail, setEnrollEmail] = useState(user?.email || 'cyber.admin@securelock.io');
  const [enrollPassword, setEnrollPassword] = useState('Password@123');
  const [enrollDeviceName, setEnrollDeviceName] = useState('Samsung Galaxy S24 Ultra (New)');
  const [isSubmittingEnroll, setIsSubmittingEnroll] = useState(false);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

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

  const handleCompanionLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollEmail || !enrollPassword || !enrollDeviceName) return;

    setIsSubmittingEnroll(true);
    // Simulate authenticating original account and linking device
    setTimeout(async () => {
      await enrollDeviceViaOriginalId(
        enrollDeviceName,
        'Samsung Galaxy S24',
        enrollEmail,
        user?.uid
      );
      setIsSubmittingEnroll(false);
      setEnrollSuccessMessage(`Device '${enrollDeviceName}' successfully linked to owner account ${enrollEmail}!`);
      setTimeout(() => {
        setEnrollSuccessMessage(null);
        setCompanionMode('normal');
      }, 1500);
    }, 800);
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
              onClick={() => setCompanionMode(companionMode === 'login' ? 'normal' : 'login')}
              className={`p-1 rounded transition-colors ${companionMode === 'login' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800 text-slate-300 hover:text-white'}`}
              title={companionMode === 'login' ? 'Return to Home' : 'Link Another Phone / Login with Original ID'}
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
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
          ) : companionMode === 'login' ? (

            /* SCREEN CONTENT: 3. ORIGINAL OWNER ACCOUNT LOGIN (FOR ENROLLING ANOTHER PHONE) */
            <div className="px-5 py-3 flex-1 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-3 pt-1">
                
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Link Another Android Phone
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Sign in with your Original Owner Account to enroll this hardware to your dashboard.
                  </p>
                </div>

                {enrollSuccessMessage && (
                  <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-[10px] text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{enrollSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleCompanionLoginSubmit} className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Original Owner Email
                    </label>
                    <input
                      type="email"
                      required
                      value={enrollEmail}
                      onChange={(e) => setEnrollEmail(e.target.value)}
                      placeholder="owner@domain.com"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Master Account Password
                    </label>
                    <input
                      type="password"
                      required
                      value={enrollPassword}
                      onChange={(e) => setEnrollPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                      Device Hardware Nickname
                    </label>
                    <input
                      type="text"
                      required
                      value={enrollDeviceName}
                      onChange={(e) => setEnrollDeviceName(e.target.value)}
                      placeholder="e.g. Pixel 8 / Galaxy S24"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="pt-1 space-y-1.5">
                    <button
                      type="submit"
                      disabled={isSubmittingEnroll}
                      className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isSubmittingEnroll ? 'Authenticating Owner...' : 'Authenticate & Link Device'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCompanionMode('normal')}
                      className="w-full py-1 text-slate-400 hover:text-white text-[10px]"
                    >
                      Cancel & Return to Active Phone
                    </button>
                  </div>
                </form>

              </div>

              <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-[9px] text-slate-400 text-center">
                Owner UID: <span className="text-cyan-400 font-mono">{user?.uid || 'usr-cyber-owner-01'}</span>
              </div>
            </div>
          ) : (

            /* SCREEN CONTENT: 4. NORMAL COMPANION APP HOME */
            <div className="px-5 py-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3 pt-1">
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

                {/* Device Status & Bound Owner Identity Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Controlled Target:</span>
                    <span className="font-semibold text-slate-200">{selectedDevice.deviceName.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Bound Owner:</span>
                    <span className="font-mono text-[10px] text-cyan-300 truncate max-w-[150px]">
                      {user?.email || 'cyber.admin@securelock.io'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px]">Device Admin:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> ENABLED (lockNow)
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-1 text-[10px]">
                    <span className="text-slate-400">Local Unlock PIN:</span>
                    <span className="font-mono text-cyan-300 font-bold">{selectedDevice.devicePin || '1234'}</span>
                  </div>
                </div>

                {/* Interactive Multi-Device & Attack Testing Buttons */}
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => setCompanionMode('login')}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pair Another Device via Original ID</span>
                  </button>

                  <button
                    onClick={testUnauthorizedAttackAttempt}
                    className="w-full py-2 px-3 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    title="Simulate an attacker trying to control this phone with a rogue account ID"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Test Rogue Attacker Attempt</span>
                  </button>
                </div>
              </div>

              {/* Bottom Navigation Simulator Pill */}
              <div className="py-1.5 text-center border-t border-slate-800/50">
                <span className="text-[9px] text-slate-400 font-mono">
                  Hardware UUID: {selectedDevice.deviceId}
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
        <span>
          Controlled Phone: <strong className="text-white">{selectedDevice.deviceName.split(' ')[0]}</strong>
          {' '}(Owner: <strong className="text-cyan-300">{user?.email?.split('@')[0] || 'owner'}</strong>)
        </span>
      </div>
    </div>
  );
};
