# Android Security Boundaries, Permissions & Limitations Report

## 1. Technical Honesty & Ethical Defense Philosophy

Modern Android operating systems (Android 10 through 14+) incorporate sophisticated sandboxing, SELinux policies, and permission gating designed to safeguard user privacy against malware, spyware, and unauthorized stalkerware.

**SecureLock strictly operates as an ethical, owner-authorized defense tool.** It intentionally does **NOT**:
1. Bypass Android OS lockscreens or extract device PINs/passwords.
2. Secretly monitor another person without consent.
3. Access microphone, camera, or private SMS in stealth mode.
4. Attempt root privilege escalation or install persistent backdoors.
5. Claim that an ordinary web browser can directly override Android system security without a companion app.

Every remote defense capability in SecureLock uses **officially supported, legitimately authorized Android APIs** requiring explicit owner enrollment.

---

## 2. Analysis of Android OS Restrictions

### A. Device Locking (`DevicePolicyManager.lockNow()`)
- **How It Works**: Standard Android apps cannot programmatically lock the phone screen unless the user explicitly grants them **Device Administrator** privileges in *Settings > Security > Device Admin Apps*.
- **API Used**: Once authorized, the companion app calls `DevicePolicyManager.lockNow()`. This immediately turns off the display and enforces the device's configured lockscreen (PIN, Pattern, or Biometrics).
- **Limitation**: `lockNow()` does not allow an app to change an existing user lockscreen PIN on modern Android (API 26+) unless provisioned as a full enterprise **Device Owner** (via QR provisioning at factory reset). Therefore, SecureLock locks the device via `lockNow()` and presents the owner's custom recovery details via our specialized `LostModeActivity`.

### B. Lost Mode Fullscreen Display (`LostModeActivity`)
- **Android Restriction**: Starting in Android 10 (API 29), Android strictly forbids applications from starting activities from the background (e.g. directly from a broadcast receiver or background thread).
- **Legitimate Implementation**:
  1. The Web Dashboard sends a high-priority FCM data message.
  2. The Android companion receives the FCM payload in `FirebaseMessagingService`.
  3. The service triggers a high-priority notification with a Full-Screen Intent (`setFullScreenIntent()`) and window flags:
     - `WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED` (or `setShowWhenLocked(true)`)
     - `WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON` (or `setTurnScreenOn(true)`)
     - `WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON`
  4. This allows the owner's customized message, emergency contact dialer, and unlock PIN keypad to display immediately over the lockscreen so a finder can contact the owner.

### C. Background Location & Android 14 Mandates
- **Android Restriction**: Android restricts background location updates to prevent battery drain and stealth tracking. Starting in Android 14, Foreground Services that use location must declare `android:foregroundServiceType="location"` and possess both `ACCESS_FINE_LOCATION` and `FOREGROUND_SERVICE_LOCATION` permissions.
- **Legitimate Implementation**:
  - SecureLock utilizes `LocationServices.getFusedLocationProviderClient()`.
  - When the owner requests a location ping, `LocationTrackingService` runs as a foreground service with a visible, persistent notification ("*SecureLock Guard Active: Location requested by owner*").
  - The service acquires 1 to 3 accurate GPS fixes, streams them securely to Firestore, and terminates immediately to conserve battery.

### D. Audio Siren Override (Silent / DND Profiles)
- **How It Works**: `AlarmAudioService` targets `AudioManager.STREAM_ALARM` with `AudioAttributes.USAGE_ALARM`.
- **API Permitted**: The Android audio subsystem routes `STREAM_ALARM` through the phone's primary loudspeaker even when the device ringer profile is set to "Vibrate" or "Silent", ensuring the owner can locate a misplaced device in their vicinity.

### E. Smart Threat Detection (Permitted Broadcasts)
SecureLock monitors only public, accessible system broadcasts without unauthorized probing:
- `Intent.ACTION_AIRPLANE_MODE_CHANGED`: Alerts owner if the phone radio is cut.
- `Intent.ACTION_BATTERY_LOW`: Dispatches a final emergency GPS coordinate before power loss.
- `android.intent.action.SIM_CARD_STATE_CHANGED`: Detects unauthorized physical SIM removal.
- `DeviceAdminReceiver.onPasswordFailed()`: Notifies owner of repeated incorrect local unlock attempts.

---

## 3. Required Permissions Matrix

| Permission | Category | Purpose in SecureLock |
|---|---|---|
| `BIND_DEVICE_ADMIN` | Special Device Admin | Required to invoke `DevicePolicyManager.lockNow()`. Explicitly approved by user in Android Settings. |
| `ACCESS_FINE_LOCATION` | Dangerous (Runtime) | Captures high-accuracy GPS coordinates for device recovery. |
| `ACCESS_COARSE_LOCATION` | Dangerous (Runtime) | Fallback network triangulation (Wi-Fi/Cell towers). |
| `FOREGROUND_SERVICE` | Normal | Required to maintain active connection during location ping. |
| `FOREGROUND_SERVICE_LOCATION` | Special (Android 14) | Mandatory declaration for foreground location services. |
| `POST_NOTIFICATIONS` | Dangerous (Android 13+) | Displays persistent notification required for foreground tasks. |
| `WAKE_LOCK` | Normal | Prevents CPU sleep during remote siren alarm execution. |
| `RECEIVE_BOOT_COMPLETED` | Normal | Re-initializes threat listeners after phone reboot. |
| `READ_PHONE_STATE` | Dangerous (Runtime) | Listens for SIM card ejection broadcasts. |

---

## 4. Privacy & Anti-Surveillance Safeguards

1. **Explicit Owner Consent**: The Android Companion app cannot function as a stealth package. It displays an application launcher icon and explicit permission checklist.
2. **Persistent Visual Indicators**: When GPS tracking or alarm triggers occur, Android system icons and notifications are displayed to ensure transparency.
3. **No Private Data Leaks on Lost Screen**: The Lost Mode screen displays only the owner's chosen message and single emergency phone number. No emails, authentication tokens, passwords, or stored contacts are ever exposed to the finder.
