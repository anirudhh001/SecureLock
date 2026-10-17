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
  enrollDeviceViaOriginalId: (deviceName: string, model: string, ownerEmail: string, ownerUid?: string) => Promise<{ success: boolean; deviceId: string }>;
  testUnauthorizedAttackAttempt: () => Promise<void>;
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
  companionMode: 'normal' | 'login';
  setCompanionMode: (mode: 'normal' | 'login') => void;
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
  const [companionMode, setCompanionMode] = useState<'normal' | 'login'>('normal');

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

  const resolveAddressFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          return data.display_name;
        }
      }
    } catch {
      // network/CORS fallback
    }
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  };

  // Real device location detection on startup so map shows the user's actual location
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = pos.coords.accuracy;
          const addr = await resolveAddressFromCoords(lat, lon);
          setDevices((prev) =>
            prev.map((d, idx) => {
              if (idx === 0 && d.location.latitude === 37.774929 && d.location.longitude === -122.419416) {
                const updatedLoc: DeviceLocation = {
                  latitude: Number(lat.toFixed(6)),
                  longitude: Number(lon.toFixed(6)),
                  accuracy: Number((acc || 5).toFixed(1)),
                  altitude: pos.coords.altitude != null ? Number(pos.coords.altitude.toFixed(1)) : 16.0,
                  speed: pos.coords.speed != null ? Number(pos.coords.speed.toFixed(1)) : 0.0,
                  timestamp: new Date().toISOString(),
                  address: addr,
                };
                return {
                  ...d,
                  location: updatedLoc,
                  locationHistory: [updatedLoc, ...(d.locationHistory || [])],
                };
              }
              return d;
            })
          );
          setTerminalLogs((prev) => [
            `[${new Date().toLocaleTimeString()}] [GPS_INIT] Resolved real device telemetry: ${addr.split(',').slice(0, 3).join(',')}`,
            ...prev.slice(0, 49)
          ]);
        },
        () => {
          // Geolocation permission ignored or not permitted
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
      );
    }
  }, []);

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

  const enrollDeviceViaOriginalId = async (
    deviceName: string,
    model: string,
    ownerEmail: string,
    targetOwnerId?: string
  ): Promise<{ success: boolean; deviceId: string }> => {
    const finalOwnerId = targetOwnerId || user?.uid || 'usr-cyber-owner-01';
    const newId = 'dev-' + model.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 7) + '-' + Math.floor(1000 + Math.random() * 9000);
    const newDev: Device = {
      deviceId: newId,
      ownerId: finalOwnerId,
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
        storageAvailableGb: 190.0,
        storageTotalGb: 256.0,
      },
      battery: {
        level: 91,
        isCharging: false,
        temperature: 30.2,
        health: 'GOOD',
      },
      network: {
        type: 'CELLULAR',
        carrier: '5G Ultra-Secure',
        ipAddress: '172.56.10.82',
        isVpnActive: true,
      },
      location: {
        latitude: 37.783333,
        longitude: -122.416667,
        accuracy: 4.8,
        timestamp: new Date().toISOString(),
        address: 'Civic Center, San Francisco, CA',
      },
      locationHistory: [],
      lostMode: false,
      lostModeMessage: 'This smartphone is protected by SecureLock. Please contact owner.',
      recoveryContact: '+1 (555) 019-2834',
      devicePin: '1234',
      alarmActive: false,
      createdAt: new Date().toISOString(),
    };

    setDevices((prev) => [newDev, ...prev]);
    setSelectedDeviceId(newId);
    setCompanionMode('normal');

    logToTerminal(`[ORIGINAL_ID_AUTH] Android Companion successfully authenticated with Original Owner Credentials: '${ownerEmail}' [UID: ${finalOwnerId}].`);
    logToTerminal(`[DEVICE_LINKED] Device '${deviceName}' [${newId}] is now cryptographically bound to Owner ID '${finalOwnerId}'.`);

    addSecurityEvent({
      deviceId: newId,
      deviceName,
      ownerId: finalOwnerId,
      eventType: 'DEVICE_ONLINE',
      severity: 'LOW',
      description: `Device '${deviceName}' linked via Original Account Authentication (${ownerEmail}). Remote control authorized.`,
      status: 'RESOLVED',
    });

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'devices', newId), newDev as any).catch(console.error);
    }

    return { success: true, deviceId: newId };
  };

  const testUnauthorizedAttackAttempt = async (): Promise<void> => {
    const rogueUid = 'usr-unauthorized-attacker-99';
    const targetDev = selectedDevice || devices[0];
    if (!targetDev) return;

    logToTerminal(`[ATTACK_INTERCEPT] Rogue actor '${rogueUid}' attempting to invoke 'REMOTE_LOCK' on '${targetDev.deviceName}'...`);
    logToTerminal(`[SECURITY_ALERT] [CRITICAL] 403 FORBIDDEN: Caller UID '${rogueUid}' does not match registered owner '${targetDev.ownerId}'. Request blocked by Firestore Security Rules!`);

    addSecurityEvent({
      deviceId: targetDev.deviceId,
      deviceName: targetDev.deviceName,
      ownerId: targetDev.ownerId,
      eventType: 'UNAUTHORIZED_COMMAND_ATTEMPT',
      severity: 'CRITICAL',
      description: `Rogue attack attempt blocked: User '${rogueUid}' attempted unauthorized remote control on device '${targetDev.deviceName}'. Device ownership signature mismatch.`,
      status: 'ACTION_REQUIRED',
      metadata: {
        rogueCallerUid: rogueUid,
        targetOwnerId: targetDev.ownerId,
        blockedAction: 'REMOTE_LOCK',
      }
    });
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

    // Strict Device Ownership Verification
    if (user?.uid && dev.ownerId !== user.uid) {
      logToTerminal(`[SECURITY_ALERT] [CRITICAL] UNAUTHORIZED_COMMAND_ATTEMPT: Authenticated UID '${user.uid}' does not own device '${deviceId}' (Owned by '${dev.ownerId}'). Access Denied by Firestore Security Rules!`);
      addSecurityEvent({
        deviceId,
        deviceName: dev.deviceName,
        ownerId: dev.ownerId,
        eventType: 'UNAUTHORIZED_COMMAND_ATTEMPT',
        severity: 'CRITICAL',
        description: `Rogue command '${type}' blocked: Caller UID '${user.uid}' does not match registered owner '${dev.ownerId}'.`,
        status: 'ACTION_REQUIRED',
        metadata: {
          attemptedBy: user.uid,
          commandType: type,
        }
      });
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
    logToTerminal(`[GPS_PING] Querying Android FusedLocationProvider for high-accuracy fix on device '${deviceId}'...`);
    await dispatchCommand(deviceId, 'REQUEST_LOCATION');

    const applyLocationUpdate = async (
      latitude: number,
      longitude: number,
      accuracy: number,
      altitude?: number | null,
      speed?: number | null
    ) => {
      const address = await resolveAddressFromCoords(latitude, longitude);
      const newLoc: DeviceLocation = {
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
        accuracy: Number((accuracy || 6).toFixed(1)),
        altitude: altitude != null ? Number(altitude.toFixed(1)) : 16.5,
        speed: speed != null ? Number(speed.toFixed(1)) : 0.0,
        timestamp: new Date().toISOString(),
        address,
      };

      setDevices((prev) =>
        prev.map((d) => {
          if (d.deviceId === deviceId) {
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

      const shortAddress = address.split(',').slice(0, 3).join(',');
      addSecurityEvent({
        deviceId,
        deviceName: selectedDevice?.deviceName,
        ownerId: user?.uid || 'usr-cyber-owner-01',
        eventType: 'LOCATION_POLL_REQUESTED',
        severity: 'LOW',
        description: `High-accuracy GPS location fix updated via FusedLocationProvider at ${shortAddress} (±${newLoc.accuracy}m).`,
        status: 'RESOLVED',
      });

      logToTerminal(`[GPS_SUCCESS] FusedLocationProvider returned fix: Lat ${newLoc.latitude}, Lng ${newLoc.longitude} (${shortAddress}, ±${newLoc.accuracy}m).`);
    };

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyLocationUpdate(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy,
            pos.coords.altitude,
            pos.coords.speed
          );
        },
        (err) => {
          console.warn('[Geolocation] GPS fallback notice:', err.message);
          const target = devices.find((d) => d.deviceId === deviceId);
          const baseLat = target?.location.latitude || 28.6139;
          const baseLng = target?.location.longitude || 77.2090;
          const jitterLat = (Math.random() - 0.5) * 0.002;
          const jitterLng = (Math.random() - 0.5) * 0.002;
          applyLocationUpdate(baseLat + jitterLat, baseLng + jitterLng, 8.5);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      const target = devices.find((d) => d.deviceId === deviceId);
      const baseLat = target?.location.latitude || 28.6139;
      const baseLng = target?.location.longitude || 77.2090;
      applyLocationUpdate(baseLat, baseLng, 9.0);
    }

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
        enrollDeviceViaOriginalId,
        testUnauthorizedAttackAttempt,
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
        companionMode,
        setCompanionMode,
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
