import React, { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  MessageSquareWarning, 
  Smartphone, 
  PhoneCall, 
  Save, 
  Send, 
  Check, 
  Key, 
  Lock,
  ArrowRight
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
    selectedDevice?.recoveryNotes || 'A reward is offered for the safe return of this phone.'
  );
  const [pin, setPin] = useState(selectedDevice?.devicePin || '1234');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!selectedDevice) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
        <Smartphone className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No device selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select an Android device to configure customized Lost Mode messaging.</p>
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
  const applyPreset = (presetType: 'standard' | 'reward' | 'urgent') => {
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
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Device: {selectedDevice.deviceName}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Custom Lost Message
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure the message and contact phone number displayed on your lost device.
          </p>
        </div>

        <button
          onClick={() => onNavigate('lost-mode')}
          className="cyber-btn-secondary text-xs"
        >
          <span>Back to Lost Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Layout: Form (Left) & Dynamic Smartphone Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 cyber-card p-6 sm:p-7 space-y-5">
          
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 transition-colors"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => applyPreset('reward')}
                className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cash Reward
              </button>
              <button
                type="button"
                onClick={() => applyPreset('urgent')}
                className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 transition-colors"
              >
                Urgent Medical
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveOnly} className="space-y-4">
            
            {/* Recovery Message textarea */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Recovery Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the message that will be displayed on your lost device."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">Displayed in large bold text on the lost device lockscreen.</p>
            </div>

            {/* Recovery Contact input */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Recovery Contact
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
                <PhoneCall className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Phone number that anyone finding the device can call immediately.</p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Additional Instructions
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Hand over to any building reception."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Emergency PIN */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Owner Emergency PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4-6 digit numeric PIN"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#101827] text-slate-900 dark:text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Use this PIN to manually unlock the phone in person when found.</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="cyber-btn-secondary text-xs flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved to Device' : saving ? 'Saving...' : 'Save Settings'}</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSaveAndActivate}
                className="cyber-btn-primary text-xs flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save & Activate Lost Mode</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Dynamic Smartphone Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Live Screen Preview
          </div>

          {/* Smartphone Mockup */}
          <div className="w-[280px] sm:w-[300px] h-[520px] bg-slate-900 rounded-[32px] p-3 shadow-xl border-4 border-slate-800 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden select-none">
            
            {/* Top speaker notch */}
            <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Screen Area */}
            <div className="flex-1 bg-slate-950 rounded-2xl my-2 p-5 flex flex-col items-center justify-between text-center relative overflow-hidden border border-slate-800">
              
              {/* Header Lock Icon */}
              <div className="space-y-1.5 pt-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  SECURELOCK
                </div>
                <h4 className="text-sm font-bold text-rose-400 tracking-tight">
                  DEVICE LOST
                </h4>
              </div>

              {/* Dynamic Recovery Message */}
              <div className="space-y-2 px-1">
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {message || 'This device has been reported as lost. Please contact the owner.'}
                </p>
                {notes && (
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {notes}
                  </p>
                )}
              </div>

              {/* Recovery Call Button */}
              <div className="w-full space-y-2 pb-2">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
                  <span className="text-[10px] text-slate-400 block">Owner Contact</span>
                  <span className="text-xs font-mono font-semibold text-white block truncate">
                    {contact || '+1 (555) 019-2834'}
                  </span>
                </div>

                <div className="py-2 px-3 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/30">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Owner</span>
                </div>
              </div>

            </div>

            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto" />

          </div>
        </div>

      </div>

    </div>
  );
};
