export type CommandType = 
  | 'REQUEST_LOCATION'
  | 'RING_ALARM'
  | 'STOP_ALARM'
  | 'ACTIVATE_LOST_MODE'
  | 'DEACTIVATE_LOST_MODE'
  | 'REMOTE_LOCK'
  | 'STATUS_CHECK';

export type CommandStatus = 'PENDING' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'EXECUTED' | 'FAILED';

export interface CommandPayload {
  customMessage?: string;
  recoveryContact?: string;
  recoveryNotes?: string;
  lockScreenPin?: string;
  soundAlarm?: boolean;
  priority?: 'HIGH' | 'NORMAL';
}

export interface RemoteCommand {
  commandId: string;
  deviceId: string;
  ownerId: string;
  type: CommandType;
  status: CommandStatus;
  payload?: CommandPayload;
  response?: string;
  createdAt: string;
  executedAt?: string;
  failureReason?: string;
}
