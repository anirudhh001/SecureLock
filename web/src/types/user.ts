export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  registeredAt: string;
  lastLoginAt: string;
  isDemoUser?: boolean;
}
