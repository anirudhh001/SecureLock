export type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventType =
  | 'LOST_MODE_ACTIVATED'
  | 'LOST_MODE_DEACTIVATED'
  | 'REMOTE_ALARM_TRIGGERED'
  | 'REMOTE_LOCK_EXECUTED'
  | 'LOCATION_POLL_REQUESTED'
  | 'NETWORK_STATE_CHANGED'
  | 'SIM_STATE_CHANGED'
  | 'BATTERY_CRITICAL_LOW'
  | 'UNAUTHORIZED_COMMAND_ATTEMPT'
  | 'FAILED_UNLOCK_ATTEMPT'
  | 'DEVICE_ADMIN_REVOCATION_ATTEMPT'
  | 'AIRPLANE_MODE_TOGGLED'
  | 'DEVICE_ONLINE'
  | 'DEVICE_OFFLINE';

export interface SecurityEvent {
  eventId: string;
  deviceId: string;
  deviceName?: string;
  ownerId: string;
  eventType: EventType;
  severity: EventSeverity;
  timestamp: string; // ISO string
  description: string;
  status: 'INVESTIGATING' | 'RESOLVED' | 'ACTION_REQUIRED' | 'LOGGED';
  metadata?: Record<string, any>;
  integrityHash?: string;
}
