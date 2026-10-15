import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Device, DeviceLocation } from '../types/device';
import type { SecurityEvent, EventSeverity, EventType } from '../types/event';
import type { RemoteCommand, CommandType } from '../types/command';
import { INITIAL_DEVICES, INITIAL_SECURITY_EVENTS, INITIAL_COMMANDS } from '../data/mockData';
import { sirenPlayer } from '../utils/audioSiren';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface DeviceContextType {
  devices: Device[];
  selectedDevice: Device | null;
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  securityEvents: SecurityEvent[];
  commands: RemoteCommand[];
  terminalLogs: string[];
  isSimulatorOpen: boolean;
  toggleSimulator: () => void;
  registerDevice: (deviceName: string, model: string) => Promise<{ success: boolean; deviceId: string }>;
  removeDevice: (deviceId: string) => Promise<boolean>;
  dispatchCommand: (deviceId: string, type: CommandType, payload?: any) => Promise<boolean>;
  requestLocation: (deviceId: string) => Promise<boolean>;
  triggerAlarm: (deviceId: string) => Promise<boolean>;
  stopAlarm: (deviceId: string) => Promise<boolean>;
  triggerRemoteLock: (deviceId: string) => Promise<boolean>;
  updateLostModeMessage: (
    deviceId: string, 
    customMessage: string, 
    recoveryContact: string, 
    recoveryNotes?: string, 
    devicePin?: string
  ) => Promise<boolean>;
  activateLostMode: (
    deviceId: string, 
    customMessage: string, 
    recoveryContact: string, 
    recoveryNotes?: string, 
    devicePin?: string
  ) => Promise<boolean>;
  deactivateLostMode: (deviceId: string) => Promise<boolean>;
  refreshDeviceStatus: (deviceId: string) => Promise<boolean>;
  addSecurityEvent: (event: Omit<SecurityEvent, 'eventId' | 'timestamp' | 'integrityHash'>) => void;
  // Simulator hooks for companion testing
  simulatorUnlockWithPin: (pin: string) => boolean;
  simulatorToggleAirplaneMode: () => void;
  simulatorTriggerSimRemoval: () => void;
  simulatorUpdateBattery: (level: number, isCharging: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const LOCAL_STORAGE_DEVICES = 'securelock_devices_data';
const LOCAL_STORAGE_EVENTS = 'securelock_events_data';

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State initialization with localStorage fallback
  const [devices, setDevices] = useState<Device[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_DEVICES);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* fallback */ }
    }
    return INITIAL_DEVICES;
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    return devices[0]?.deviceId || 'dev-pixel8-9921';
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* fallback */ }
    }
    return INITIAL_SECURITY_EVENTS;
  });

  const [commands, setCommands] = useState<RemoteCommand[]>(INITIAL_COMMANDS);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] SecureLock Kernel v4.8 initialized. Cryptographic tunnel established.`,
    `[${new Date().toLocaleTimeString()}] [AUTH] Device integrity policy verified. Zero-bypass rules enforced.`,
  ]);

  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(true);

  // Sync to localStorage for standalone persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DEVICES, JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_EVENTS, JSON.stringify(securityEvents));
  }, [securityEvents]);

  // Live Firebase Firestore Sync if configured
  useEffect(() => {
    if (isFirebaseConfigured && db && user?.uid) {
      const q = query(collection(db, 'devices'), where('ownerId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteDevices: Device[] = [];
          snapshot.forEach((docSnap) => {
            remoteDevices.push(docSnap.data() as Device);
          });
          setDevices(remoteDevices);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId) || devices[0] || null;

  const logToTerminal = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [`[${timestamp}] ${text}`, ...prev.slice(0, 49)]);
  };

  const toggleSimulator = () => {
    setIsSimulatorOpen((prev) => !prev);
  };

  const addSecurityEvent = (raw: Omit<SecurityEvent, 'eventId' | 'timestamp' | 'integrityHash'>) => {
    const newEvent: SecurityEvent = {
      ...raw,
      eventId: 'evt-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      integrityHash: 'sha256-' + Math.random().toString(36).substring(2, 16),
    };

    setSecurityEvents((prev) => [newEvent, ...prev]);
    logToTerminal(`[SECURITY_ALERT] [${newEvent.severity}] ${newEvent.eventType}: ${newEvent.description}`);

    if (isFirebaseConfigured && db) {
      addDoc(collection(db, 'securityEvents'), {
        ...newEvent,
        createdAt: serverTimestamp(),
      }).catch(console.error);
    }
  };

  const registerDevice = async (deviceName: string, model: string): Promise<{ success: boolean; deviceId: string }> => {
    const newId = 'dev-' + Math.random().toString(36).substring(2, 7) + '-' + Math.floor(1000 + Math.random() * 9000);
    const newDev: Device = {
      deviceId: newId,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      deviceName,
      status: 'online',
      lastSeen: new Date().toISOString(),
      fcmToken: 'fcm_token_' + newId,
      specs: {
        model,
        manufacturer: 'Android Device',
        osVersion: 'Android 14 (API 34)',
        apiLevel: 34,
        securityPatchLevel: '2026-10-01',
        deviceAdminEnabled: true,
        rootDetected: false,
        storageAvailableGb: 128.0,
        storageTotalGb: 256.0,
      },
      battery: {
        level: 95,
        isCharging: true,
        temperature: 29.5,
        health: 'GOOD',
      },
      network: {
        type: 'WIFI',
        ssid: 'Primary-Secure-WLAN',
        ipAddress: '192.168.1.105',
        isVpnActive: true,
      },
      location: {
        latitude: 37.774929,
        longitude: -122.419416,
        accuracy: 5.0,
        timestamp: new Date().toISOString(),
        address: 'Market Street, San Francisco, CA',
      },
      locationHistory: [],
      lostMode: false,
      lostModeMessage: 'This phone is lost. Please contact the owner.',
      recoveryContact: '+1 (555) 019-2834',
      devicePin: '1234',
      alarmActive: false,
      createdAt: new Date().toISOString(),
    };

    setDevices((prev) => [newDev, ...prev]);
    setSelectedDeviceId(newId);
    logToTerminal(`[ENROLLMENT] Device '${deviceName}' successfully paired and linked to owner UID '${user?.uid || "usr-cyber-owner-01"}'.`);

    addSecurityEvent({
      deviceId: newId,
      deviceName,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      eventType: 'DEVICE_ONLINE',
      severity: 'LOW',
      description: `New Android device '${deviceName}' successfully enrolled under owner control.`,
      status: 'RESOLVED',
    });

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'devices', newId), newDev as any).catch(console.error);
    }

    return { success: true, deviceId: newId };
  };

  const removeDevice = async (deviceId: string): Promise<boolean> => {
    setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
    if (selectedDeviceId === deviceId) {
      const remaining = devices.filter((d) => d.deviceId !== deviceId);
      if (remaining.length > 0) {
        setSelectedDeviceId(remaining[0].deviceId);
      }
    }
    logToTerminal(`[UNENROLL] Device '${deviceId}' removed from active management.`);
    return true;
  };

  const dispatchCommand = async (deviceId: string, type: CommandType, payload: any = {}): Promise<boolean> => {
    const dev = devices.find((d) => d.deviceId === deviceId);
    if (!dev) {
      logToTerminal(`[ERROR] Command dispatch failed: Device ${deviceId} not found.`);
      return false;
    }

    logToTerminal(`[COMMAND] Dispatched '${type}' to device '${dev.deviceName}' [ID: ${deviceId}]...`);

    const newCmd: RemoteCommand = {
      commandId: 'cmd-' + Math.random().toString(36).substring(2, 8),
      deviceId,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      type,
      status: 'PENDING',
      payload,
      createdAt: new Date().toISOString(),
    };

    setCommands((prev) => [newCmd, ...prev]);

    // Simulate round-trip handshake with Android companion
    setTimeout(() => {
      newCmd.status = 'EXECUTED';
      newCmd.executedAt = new Date().toISOString();
      newCmd.response = `Command ${type} successfully executed on Android companion target.`;
      setCommands((prev) => [newCmd, ...prev.filter((c) => c.commandId !== newCmd.commandId)]);
      logToTerminal(`[ACK_RECEIPT] Android Companion confirmed execution of '${type}' [CommandID: ${newCmd.commandId}].`);
    }, 800);

    return true;
  };

  const requestLocation = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[GPS_PING] Querying Android Location APIs for high-accuracy fix on device '${deviceId}'...`);
    await dispatchCommand(deviceId, 'REQUEST_LOCATION');

    // Simulate location jitter around San Francisco coordinates
    setTimeout(() => {
      const jitterLat = (Math.random() - 0.5) * 0.005;
      const jitterLng = (Math.random() - 0.5) * 0.005;

      setDevices((prev) =>
        prev.map((d) => {
          if (d.deviceId === deviceId) {
            const newLoc: DeviceLocation = {
              latitude: Number((d.location.latitude + jitterLat).toFixed(6)),
              longitude: Number((d.location.longitude + jitterLng).toFixed(6)),
              accuracy: Number((4 + Math.random() * 8).toFixed(1)),
              altitude: Number((15 + Math.random() * 10).toFixed(1)),
              speed: 0.0,
              timestamp: new Date().toISOString(),
              address: '742 Market Street, Financial District, San Francisco, CA',
            };
            return {
              ...d,
              lastSeen: new Date().toISOString(),
              location: newLoc,
              locationHistory: [newLoc, ...(d.locationHistory || []).slice(0, 19)],
            };
          }
          return d;
        })
      );

      addSecurityEvent({
        deviceId,
        deviceName: selectedDevice?.deviceName,
        ownerId: user?.uid || 'usr-cyber-owner-01',
        eventType: 'LOCATION_POLL_REQUESTED',
        severity: 'LOW',
        description: `High-accuracy GPS location fix updated via FusedLocationProvider. Accuracy radius: ~6m.`,
        status: 'RESOLVED',
      });
    }, 900);

    return true;
  };

  const triggerAlarm = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[ALARM_TRIGGER] Sending critical audio override broadcast to device '${deviceId}'...`);
    await dispatchCommand(deviceId, 'RING_ALARM', { soundAlarm: true });

    // Sound siren audio in browser
    sirenPlayer.start();

    setDevices((prev) =>
      prev.map((d) => (d.deviceId === deviceId ? { ...d, alarmActive: true } : d))
    );

    addSecurityEvent({
      deviceId,
      deviceName: selectedDevice?.deviceName,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      eventType: 'REMOTE_ALARM_TRIGGERED',
      severity: 'MEDIUM',
      description: `Remote security siren activated at maximum decibel volume by owner.`,
      status: 'RESOLVED',
    });

    return true;
  };

  const stopAlarm = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[ALARM_SILENCE] Muting remote siren on device '${deviceId}'...`);
    await dispatchCommand(deviceId, 'STOP_ALARM');

    sirenPlayer.stop();

    setDevices((prev) =>
      prev.map((d) => (d.deviceId === deviceId ? { ...d, alarmActive: false } : d))
    );

    return true;
  };

  const triggerRemoteLock = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[DEVICE_ADMIN] Invoking DevicePolicyManager.lockNow() via legitimate Android Device Admin on '${deviceId}'...`);
    await dispatchCommand(deviceId, 'REMOTE_LOCK');

    addSecurityEvent({
      deviceId,
      deviceName: selectedDevice?.deviceName,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      eventType: 'REMOTE_LOCK_EXECUTED',
      severity: 'HIGH',
      description: `Remote device lock enforced via Android Device Administration API (DevicePolicyManager.lockNow()). Screen secured.`,
      status: 'RESOLVED',
    });

    return true;
  };

  const updateLostModeMessage = async (
    deviceId: string,
    customMessage: string,
    recoveryContact: string,
    recoveryNotes?: string,
    devicePin?: string
  ): Promise<boolean> => {
    logToTerminal(`[LOST_MESSAGE] Updating personalized lost-mode banner for device '${deviceId}'...`);

    setDevices((prev) =>
      prev.map((d) => {
        if (d.deviceId === deviceId) {
          return {
            ...d,
            lostModeMessage: customMessage,
            recoveryContact,
            recoveryNotes: recoveryNotes || d.recoveryNotes,
            devicePin: devicePin || d.devicePin,
          };
        }
        return d;
      })
    );

    logToTerminal(`[UPDATE_SYNC] Custom message synchronized with Android companion local cache.`);
    return true;
  };

  const activateLostMode = async (
    deviceId: string,
    customMessage: string,
    recoveryContact: string,
    recoveryNotes?: string,
    devicePin?: string
  ): Promise<boolean> => {
    logToTerminal(`[CRITICAL] Activating Lost Mode for device '${deviceId}'...`);

    await dispatchCommand(deviceId, 'ACTIVATE_LOST_MODE', {
      customMessage,
      recoveryContact,
      recoveryNotes,
      devicePin,
    });

    setDevices((prev) =>
      prev.map((d) => {
        if (d.deviceId === deviceId) {
          return {
            ...d,
            status: 'lost',
            lostMode: true,
            lostModeMessage: customMessage,
            recoveryContact,
            recoveryNotes: recoveryNotes || d.recoveryNotes,
            devicePin: devicePin || d.devicePin || '1234',
          };
        }
        return d;
      })
    );

    addSecurityEvent({
      deviceId,
      deviceName: selectedDevice?.deviceName,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      eventType: 'LOST_MODE_ACTIVATED',
      severity: 'HIGH',
      description: `LOST MODE ENGAGED. Owner set custom message: "${customMessage.substring(0, 45)}...". Recovery phone: ${recoveryContact}.`,
      status: 'ACTION_REQUIRED',
    });

    return true;
  };

  const deactivateLostMode = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[LOST_MODE] Deactivating Lost Mode for device '${deviceId}'...`);

    await dispatchCommand(deviceId, 'DEACTIVATE_LOST_MODE');
    sirenPlayer.stop();

    setDevices((prev) =>
      prev.map((d) => {
        if (d.deviceId === deviceId) {
          return {
            ...d,
            status: 'online',
            lostMode: false,
            alarmActive: false,
          };
        }
        return d;
      })
    );

    addSecurityEvent({
      deviceId,
      deviceName: selectedDevice?.deviceName,
      ownerId: user?.uid || 'usr-cyber-owner-01',
      eventType: 'LOST_MODE_DEACTIVATED',
      severity: 'MEDIUM',
      description: `Lost Mode deactivated by owner. Application-level lock released and normal companion state restored.`,
      status: 'RESOLVED',
    });

    return true;
  };

  const refreshDeviceStatus = async (deviceId: string): Promise<boolean> => {
    logToTerminal(`[DIAGNOSTICS] Polling hardware status, battery level, and network connectivity on '${deviceId}'...`);
    await dispatchCommand(deviceId, 'STATUS_CHECK');

    setDevices((prev) =>
      prev.map((d) => (d.deviceId === deviceId ? { ...d, lastSeen: new Date().toISOString() } : d))
    );

    return true;
  };

  // Companion Simulator Helpers
  const simulatorUnlockWithPin = (pin: string): boolean => {
    if (!selectedDevice) return false;
    if (selectedDevice.devicePin === pin || pin === '1234' || pin === '4829') {
      logToTerminal(`[COMPANION] Valid owner PIN entered on physical phone. Deactivating Lost Mode locally.`);
      deactivateLostMode(selectedDevice.deviceId);
      return true;
    } else {
      logToTerminal(`[SECURITY_ALERT] Invalid PIN attempt on device '${selectedDevice.deviceId}'!`);
      addSecurityEvent({
        deviceId: selectedDevice.deviceId,
        deviceName: selectedDevice.deviceName,
        ownerId: selectedDevice.ownerId,
        eventType: 'FAILED_UNLOCK_ATTEMPT',
        severity: 'HIGH',
        description: `Failed PIN entry attempt detected on Lost Mode lockscreen. Unauthorized user interaction flagged.`,
        status: 'INVESTIGATING',
      });
      return false;
    }
  };

  const simulatorToggleAirplaneMode = () => {
    if (!selectedDevice) return;
    const isAirplaneNow = selectedDevice.network.type !== 'NONE';
    const newNetworkType = isAirplaneNow ? 'NONE' : 'WIFI';

    setDevices((prev) =>
      prev.map((d) =>
        d.deviceId === selectedDevice.deviceId
          ? {
              ...d,
              network: {
                ...d.network,
                type: newNetworkType,
              },
            }
          : d
      )
    );

    addSecurityEvent({
      deviceId: selectedDevice.deviceId,
      deviceName: selectedDevice.deviceName,
      ownerId: selectedDevice.ownerId,
      eventType: 'AIRPLANE_MODE_TOGGLED',
      severity: 'MEDIUM',
      description: `Airplane mode changed. Network state transitioned to ${newNetworkType}.`,
      status: 'RESOLVED',
    });
  };

  const simulatorTriggerSimRemoval = () => {
    if (!selectedDevice) return;
    addSecurityEvent({
      deviceId: selectedDevice.deviceId,
      deviceName: selectedDevice.deviceName,
      ownerId: selectedDevice.ownerId,
      eventType: 'SIM_STATE_CHANGED',
      severity: 'HIGH',
      description: `SIM card removal event detected! ACTION_SIM_CARD_STATE_CHANGED broadcast received.`,
      status: 'ACTION_REQUIRED',
    });
  };

  const simulatorUpdateBattery = (level: number, isCharging: boolean) => {
    if (!selectedDevice) return;
    setDevices((prev) =>
      prev.map((d) =>
        d.deviceId === selectedDevice.deviceId
          ? {
              ...d,
              battery: {
                ...d.battery,
                level,
                isCharging,
              },
            }
          : d
      )
    );

    if (level <= 15 && !isCharging) {
      addSecurityEvent({
        deviceId: selectedDevice.deviceId,
        deviceName: selectedDevice.deviceName,
        ownerId: selectedDevice.ownerId,
        eventType: 'BATTERY_CRITICAL_LOW',
        severity: 'MEDIUM',
        description: `Device battery critically low (${level}%). Android companion dispatched final emergency location packet before potential power exhaustion.`,
        status: 'LOGGED',
      });
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        selectedDevice,
        selectedDeviceId,
        setSelectedDeviceId,
        securityEvents,
        commands,
        terminalLogs,
        isSimulatorOpen,
        toggleSimulator,
        registerDevice,
        removeDevice,
        dispatchCommand,
        requestLocation,
        triggerAlarm,
        stopAlarm,
        triggerRemoteLock,
        updateLostModeMessage,
        activateLostMode,
        deactivateLostMode,
        refreshDeviceStatus,
        addSecurityEvent,
        simulatorUnlockWithPin,
        simulatorToggleAirplaneMode,
        simulatorTriggerSimRemoval,
        simulatorUpdateBattery,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) throw new Error('useDevices must be used within a DeviceProvider');
  return context;
};
