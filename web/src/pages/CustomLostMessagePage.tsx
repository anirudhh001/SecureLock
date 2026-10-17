import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  MessageSquareWarning, 
  Smartphone, 
  PhoneCall, 
  ShieldAlert, 
  Save, 
  Send, 
  Check, 
  Sparkles, 
  Key, 
  Gift, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

export const CustomLostMessagePage: React.FC<Props> = ({ onNavigate }) => {
  const { 
    selectedDevice, 
    updateLostModeMessage, 
    activateLostMode 
  } = useDevices();

  const [message, setMessage] = useState(
    selectedDevice?.lostModeMessage || 'THIS PHONE IS REPORTED LOST. Please return to the verified owner.'
  );
  const [contact, setContact] = useState(selectedDevice?.recoveryContact || '+1 (555) 019-2834');
  const [notes, setNotes] = useState(
    selectedDevice?.recoveryNotes || 'A cash reward is guaranteed upon safe return to the owner or nearest security desk.'
  );
  const [pin, setPin] = useState(selectedDevice?.devicePin || '1234');
  const [soundAlarmImmediately, setSoundAlarmImmediately] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please select a device to configure customized Lost Mode messaging.
      </div>
    );
  }

  // Preset Message Templates
  const applyPreset = (presetType: 'standard' | 'reward' | 'urgent' | 'commute') => {
    switch (presetType) {
      case 'standard':
        setMessage('This phone has been lost. Please contact the owner immediately.');
        setNotes('Hand over to any official receptionist or call the number below.');
        break;
      case 'reward':
        setMessage('GENEROUS CASH REWARD: This smartphone was misplaced. Please return safely.');
        setNotes('Call owner at any hour. A $200 cash reward will be given immediately upon return.');
        break;
      case 'urgent':
        setMessage('CRITICAL MEDICAL CONTACT: This phone contains urgent emergency info.');
        setNotes('Please call the emergency phone number immediately. Vital personal phone.');
        break;
      case 'commute':
        setMessage('Left behind during commute. Please return to the owner.');
        setNotes('Please drop off at station customer service or call number below.');
        break;
    }
  };

  const handleSaveOnly = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateLostModeMessage(selectedDevice.deviceId, message, contact, notes, pin);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAndActivate = async () => {
    setSaving(true);
    await activateLostMode(selectedDevice.deviceId, message, contact, notes, pin);
    setSaving(false);
    onNavigate('lost-mode');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              CUSTOM RECOVERY BROADCAST
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            CUSTOM LOST-MODE MESSAGE STUDIO
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure personalized on-screen emergency contact data rendered across the phone's locked screen.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Message Synchronized with Android Companion!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form Editor & Live Device Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Presets */}
          <div className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Message Presets
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 font-medium transition-colors"
              >
                Standard Lost
              </button>
              <button
                type="button"
                onClick={() => applyPreset('reward')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500 text-xs text-amber-300 font-medium transition-colors flex items-center gap-1"
              >
                <Gift className="w-3 h-3" /> Cash Reward
              </button>
              <button
                type="button"
                onClick={() => applyPreset('urgent')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs text-rose-300 font-medium transition-colors"
              >
                Urgent Priority
              </button>
              <button
                type="button"
                onClick={() => applyPreset('commute')}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 font-medium transition-colors"
              >
                Transit / Commute
              </button>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveOnly} className="bg-cyber-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            
            {/* Primary Custom Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Primary Lost Banner Message
                </label>
                <span className="text-[10px] text-slate-500">{message.length}/160 chars</span>
              </div>
              <textarea
                rows={3}
                required
                maxLength={160}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. This phone has been lost. Please contact the owner."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed"
              />
            </div>

            {/* Emergency Recovery Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Recovery Phone Number (Direct Single-Tap Dialer)
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +1 (555) 987-6543 or 98XXXXXXXX"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Rendered as a prominent green dial button on the phone. Finder can tap to call only this authorized number.
              </p>
            </div>

            {/* Instructions / Reward Details */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Instructions or Reward Information (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please leave at Building Reception or call immediately."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Owner Unlock PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Physical Phone Unlock PIN (Hidden from Phone Screen)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4-6 digit numeric PIN (e.g. 1234)"
                  className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-blue-300 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                This PIN is never shown on the lost phone screen. Only the authenticated owner knows this PIN to unlock the phone once recovered.
              </p>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-slate-200">Zero Private Exposure:</strong> Neither your SecureLock account password, email, nor PIN will be revealed on the lost phone screen.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-blue-400" />
                <span>{saving ? 'Syncing...' : 'Save & Sync Message'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndActivate}
                disabled={saving}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Save & Activate Lost Mode</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Preview: 5 Cols (Interactive Phone Mockup Frame) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full text-center mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Live Android Screen Mockup
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Real-time rendering of what the finder will see on the smartphone
            </p>
          </div>

          {/* Android Smartphone Frame */}
          <div className="w-[300px] bg-slate-900 border-4 border-slate-700 rounded-[44px] shadow-2xl p-3 relative overflow-hidden ring-1 ring-cyan-500/20">
            
            {/* Top speaker & camera notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            </div>

            {/* Screen Canvas */}
            <div className="h-[460px] rounded-[28px] bg-gradient-to-b from-slate-950 via-rose-950/50 to-slate-950 p-4 flex flex-col justify-between text-center border border-rose-500/30">
              
              <div className="space-y-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <h4 className="text-sm font-black text-rose-400 uppercase tracking-wider">
                    DEVICE IN LOST MODE
                  </h4>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-[9px] text-rose-300 font-mono">
                    SECURELOCK DEFENSE
                  </div>
                </div>

                {/* Live Custom Message Body */}
                <div className="p-3 bg-slate-900/90 border border-rose-500/40 rounded-xl text-left space-y-1.5 shadow-lg">
                  <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">
                    Message from Owner
                  </span>
                  <p className="text-xs font-semibold text-white leading-relaxed break-words">
                    "{message || 'Please return this phone.'}"
                  </p>
                  {notes && (
                    <p className="text-[10px] text-slate-300 italic pt-1.5 border-t border-slate-800 leading-snug">
                      {notes}
                    </p>
                  )}
                </div>

                {/* Emergency Contact Dialer Button */}
                {contact && (
                  <div className="py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50">
                    <PhoneCall className="w-4 h-4 text-slate-950" />
                    <span>CALL OWNER: {contact}</span>
                  </div>
                )}
              </div>

              {/* Bottom Unlock Keypad Prompt */}
              <div className="pt-3 border-t border-slate-900/90 text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center justify-center gap-1 text-slate-300">
                  <Key className="w-3 h-3 text-cyan-400" />
                  <span>Owner PIN Unlock Available</span>
                </div>
                <p className="text-[9px] text-cyan-400 font-mono">
                  Continuous GPS Stream Transmitting to Owner
                </p>
              </div>

            </div>

            {/* Bottom soft navigation pill */}
            <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>

          </div>

        </div>

      </div>

    </div>
  );
};
