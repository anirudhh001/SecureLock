export type DeviceStatus = 'online' | 'offline' | 'lost';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: string; // ISO string
  address?: string;
}

export interface DeviceBattery {
  level: number; // 0 to 100
  isCharging: boolean;
  temperature?: number; // Celsius
  health?: 'GOOD' | 'OVERHEAT' | 'DEAD' | 'OVER_VOLTAGE' | 'UNSPECIFIED_FAILURE';
}

export interface DeviceNetwork {
  type: 'WIFI' | 'CELLULAR' | 'NONE';
  ssid?: string;
  carrier?: string;
  ipAddress?: string;
  isVpnActive?: boolean;
}

export interface DeviceSpecs {
  model: string;
  manufacturer: string;
  osVersion: string;
  apiLevel: number;
  securityPatchLevel: string;
  deviceAdminEnabled: boolean;
  rootDetected: boolean;
  storageAvailableGb: number;
  storageTotalGb: number;
}

export interface Device {
  deviceId: string;
  ownerId: string;
  deviceName: string;
  status: DeviceStatus;
  lastSeen: string; // ISO string
  fcmToken?: string;
  specs: DeviceSpecs;
  battery: DeviceBattery;
  network: DeviceNetwork;
  location: DeviceLocation;
  locationHistory?: DeviceLocation[];
  lostMode: boolean;
  lostModeMessage?: string;
  recoveryContact?: string;
  recoveryNotes?: string;
  devicePin?: string;
  alarmActive?: boolean;
  createdAt: string;
}
