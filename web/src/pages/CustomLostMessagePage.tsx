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
  Lock
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
    selectedDevice?.lostModeMessage || 'This device has been reported as lost. Please contact the owner.'
  );
  const [contact, setContact] = useState(selectedDevice?.recoveryContact || '+1 (555) 019-2834');
  const [notes, setNotes] = useState(
    selectedDevice?.recoveryNotes || 'A cash reward is guaranteed upon safe return to the owner or nearest security desk.'
  );
  const [pin, setPin] = useState(selectedDevice?.devicePin || '1234');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-400 space-y-3">
        <Smartphone className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No device selected</h3>
        <p className="text-xs text-slate-400">Please select an Android device to configure customized Lost Mode messaging.</p>
        <button
          onClick={() => onNavigate('devices')}
          className="cyber-btn-primary text-xs"
        >
          View Devices
        </button>
      </div>
    );
  }

  // Preset Message Templates
  const applyPreset = (presetType: 'standard' | 'reward' | 'urgent' | 'commute') => {
    switch (presetType) {
      case 'standard':
        setMessage('This device has been reported as lost. Please contact the owner.');
        setNotes('Hand over to any official receptionist or call the number below.');
        break;
      case 'reward':
        setMessage('GENEROUS CASH REWARD: This smartphone was misplaced. Please return safely.');
        setNotes('Call owner at any hour. A cash reward will be given immediately upon return.');
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              CUSTOM LOST MODE MESSAGE
            </span>
            <span className="text-xs font-mono text-slate-400">Target: {selectedDevice.deviceName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Recovery Message Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure the message and contact info displayed on your lost device's screen.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Message Synchronized with Android Companion!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form Editor & Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: 7 Cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Presets */}
          <div className="cyber-card p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Quick Message Presets
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-3 py-1.5 rounded-lg bg-[#1A2537] border border-white/[0.08] hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition-colors"
              >
                Standard Lost
              </button>
              <button
                type="button"
                onClick={() => applyPreset('reward')}
                className="px-3 py-1.5 rounded-lg bg-[#1A2537] border border-white/[0.08] hover:border-amber-500/40 text-xs text-amber-300 font-medium transition-colors flex items-center gap-1"
              >
                <Gift className="w-3 h-3" /> Cash Reward
              </button>
              <button
                type="button"
                onClick={() => applyPreset('urgent')}
                className="px-3 py-1.5 rounded-lg bg-[#1A2537] border border-white/[0.08] hover:border-rose-500/40 text-xs text-rose-300 font-medium transition-colors"
              >
                Urgent Priority
              </button>
              <button
                type="button"
                onClick={() => applyPreset('commute')}
                className="px-3 py-1.5 rounded-lg bg-[#1A2537] border border-white/[0.08] hover:border-blue-500/40 text-xs text-slate-300 hover:text-white transition-colors"
              >
                Transit / Commute
              </button>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSaveOnly} className="cyber-card p-6 shadow-xl space-y-5">
            
            {/* Recovery Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Recovery Message
                </label>
                <span className="text-[10px] text-slate-400">{message.length}/160 chars</span>
              </div>
              <textarea
                rows={3}
                required
                maxLength={160}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the message that will be displayed on your lost device."
                className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                "Enter the message that will be displayed on your lost device."
              </p>
            </div>

            {/* Recovery Contact */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                Recovery Contact
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +1 (555) 987-6543 or 98XXXXXXXX"
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Emergency phone number available for one-tap calling from the locked device screen.
              </p>
            </div>

            {/* Instructions / Reward Details */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                Instructions or Reward Information (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please leave at Building Reception or call immediately."
                className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Owner Unlock PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
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
                  className="w-full bg-[#0B1120] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-blue-300 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                This PIN is never shown on the lost device. Only you know this PIN to unlock the phone upon recovery.
              </p>
            </div>

            {/* Privacy Safeguard Note */}
            <div className="p-3 bg-[#0B1120] border border-white/[0.08] rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
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
                className="cyber-btn-secondary flex-1 py-2.5 text-xs font-semibold"
              >
                <Save className="w-4 h-4 text-blue-400" />
                <span>{saving ? 'Saving...' : 'Save & Sync Message'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndActivate}
                disabled={saving}
                className="cyber-btn-primary flex-1 py-2.5 text-xs font-bold"
              >
                <Send className="w-4 h-4" />
                <span>Save & Activate Lost Mode</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Preview: 5 Cols (Live Spec Preview Card & Android Frame) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Exact Specification Preview Card */}
          <div className="cyber-card p-5 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareWarning className="w-4 h-4 text-blue-400" />
              Live Preview
            </span>
            
            {/* Themed Preview Card per specification */}
            <div className="bg-[#0B1120] border border-white/[0.12] rounded-xl p-5 text-center font-mono space-y-3 shadow-inner">
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="font-bold tracking-widest text-xs">SECURELOCK</span>
              </div>

              <div className="py-2">
                <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                  DEVICE LOST
                </h4>
              </div>

              <div className="text-xs text-slate-300 font-sans leading-relaxed px-2">
                {message || 'This device has been reported as lost. Please contact the owner.'}
              </div>

              {notes && (
                <div className="text-[11px] text-slate-400 italic font-sans pt-1">
                  {notes}
                </div>
              )}

              <div className="pt-2 border-t border-white/[0.08] text-xs font-mono font-semibold text-emerald-400">
                Contact: {contact || 'XXXXXXXX'}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              The preview updates dynamically as you type in the form.
            </p>
          </div>

          {/* Android Smartphone Frame Preview */}
          <div className="cyber-card p-5 space-y-3">
            <div className="text-center mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-400" />
                On-Device Rendering
              </span>
            </div>

            {/* Device Mockup */}
            <div className="w-[260px] mx-auto bg-[#070B14] border-4 border-slate-700 rounded-[36px] shadow-2xl p-2.5 relative overflow-hidden">
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />

              <div className="h-[380px] rounded-[22px] bg-[#0B1120] border border-rose-500/30 p-3.5 flex flex-col justify-between text-center">
                <div className="space-y-3 pt-1">
                  <div className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-rose-400 uppercase">DEVICE IN LOST MODE</h5>
                    <span className="text-[8px] font-mono text-slate-500">SecureLock Defense</span>
                  </div>

                  <div className="p-2.5 bg-[#151E2E] border border-white/[0.08] rounded-lg text-left space-y-1">
                    <p className="text-[11px] font-medium text-slate-200 leading-snug">
                      "{message || 'Please return this phone.'}"
                    </p>
                  </div>

                  {contact && (
                    <div className="py-2 px-3 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1.5 shadow-sm">
                      <PhoneCall className="w-3 h-3" />
                      <span>CALL: {contact}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[8px] text-slate-500">
                  <p>Owner PIN Unlock Supported</p>
                  <p className="font-mono text-blue-400">GPS Stream Active</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
