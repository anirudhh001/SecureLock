# SecureLock Cybersecurity Testing Guide & Test Matrix

This testing guide provides comprehensive verification procedures for all 18+ required test cases specified in the SecureLock project requirements.

---

## Complete Test Case Matrix

| ID | Test Case Name | Objective | Pre-conditions | Test Steps | Expected Result | Pass / Fail |
|---|---|---|---|---|---|---|
| **TC-01** | User Registration | Verify owner account creation with password strength validation | Unauthenticated user | 1. Navigate to `/register`<br>2. Enter email and weak password<br>3. Verify rejection<br>4. Enter strong password (8+ chars, upper, lower, number, symbol)<br>5. Check consent box and submit | Strong account created; redirected to email verification. | PASS |
| **TC-02** | Login & Logout | Verify secure session establishment and termination | Registered owner | 1. Navigate to `/login`<br>2. Submit valid credentials<br>3. Verify dashboard loads<br>4. Click Sign Out | Auth token cleared; redirected to login; protected routes inaccessible. | PASS |
| **TC-03** | Email Verification | Validate identity trust workflow | Newly registered owner | 1. Navigate to `/verify-email`<br>2. Click "Resend Verification"<br>3. Click "I Have Verified" | System confirms verification status and updates profile document. | PASS |
| **TC-04** | Password Reset | Verify self-service password recovery | Forgotten password | 1. On login, click "Forgot Password"<br>2. Enter registered email<br>3. Submit request | Secure password reset email dispatched; status banner displayed. | PASS |
| **TC-05** | Device Registration | Verify pairing token and hardware enrollment | Authenticated owner | 1. Navigate to `/devices`<br>2. Click "Enroll New Device"<br>3. Enter nickname and model<br>4. Generate token | Unique device ID generated; QR code displayed; device linked to owner UID. | PASS |
| **TC-06** | Device Ownership Verification | Ensure strict owner-device cryptographic binding | Two distinct users | 1. User B attempts to issue command to User A's device ID<br>2. Check Firestore Rules / Cloud Function | Request rejected (`permission-denied`); `UNAUTHORIZED_COMMAND_ATTEMPT` alert logged. | PASS |
| **TC-07** | Location Request | Verify FusedLocationProvider ping | Paired device online | 1. Click "Request Real-Time Location"<br>2. Monitor command bus | Android service activates GPS; coordinates, accuracy radius (±6m), and address updated on map. | PASS |
| **TC-08** | Remote Siren Alarm | Test max-decibel siren trigger and audio synthesizer | Paired device | 1. Click "Trigger Siren Alarm"<br>2. Check Android companion and browser audio<br>3. Click "Mute Alarm" | Siren oscillates at maximum volume overriding silent mode; mute terminates sound. | PASS |
| **TC-09** | Lost Mode Activation | Verify emergency lockdown workflow | Paired device | 1. Open Lost Mode console<br>2. Click "Engage Lost Mode Now"<br>3. Check companion phone simulator | Screen displays emergency lock banner; phone status transitions to `lost`. | PASS |
| **TC-10** | Custom Lost Mode Message | Verify personalized recovery message rendering | Lost Mode configured | 1. Navigate to `/lost-message`<br>2. Enter custom message: *"Misplaced phone. Call owner."*<br>3. Enter phone number: `+1 (555) 019-2834`<br>4. Click Save | Message and single-tap dialer appear on the phone's locked screen. | PASS |
| **TC-11** | Editing Lost Mode Message | Verify dynamic updating of recovery info | Lost Mode active | 1. Edit message to include *"Reward: $200"*<br>2. Click "Save & Sync Message" | Android companion updates on-screen message without deactivating Lost Mode. | PASS |
| **TC-12** | Deactivating Lost Mode | Verify secure recovery release | Device in Lost Mode | 1. From dashboard, click "Deactivate Lost Mode" OR enter PIN on phone<br>2. Confirm deactivation | Application lock released; normal companion home restored; audit event logged. | PASS |
| **TC-13** | Remote Lock Functionality | Verify Device Admin lock screen enforcement | Device Admin enabled | 1. Click "Remote Lock" on dashboard | `DevicePolicyManager.lockNow()` executes; screen turns off and locks immediately. | PASS |
| **TC-14** | Security Alerts Stream | Verify smart threat detection dispatch | Active device | 1. Eject SIM or toggle Airplane Mode in companion simulator<br>2. Check Security Center | Instant HIGH severity alert appears in real-time alert feed. | PASS |
| **TC-15** | Unauthorized Command Attempt | Verify rogue command interception | Non-owner token | 1. Inject spoofed command with forged UID into `/devices/{id}/commands` | Firestore Rules reject write; CRITICAL audit alert recorded. | PASS |
| **TC-16** | Firestore Security Rules | Audit immutable records and access control | Authenticated user | 1. Attempt `delete` on `securityEvents/{id}`<br>2. Attempt `update` on `ownerId` | Write operation denied (`if false` and `request.auth.uid == resource.data.ownerId`). | PASS |
| **TC-17** | Offline Device Behavior | Verify graceful handling when device disconnected | Device offline | 1. Turn off device radios (Airplane mode)<br>2. Dispatch command from dashboard | Command queued as `PENDING`; dashboard displays last seen time and cached location. | PASS |
| **TC-18** | Expired Session Handling | Ensure automatic logout on token invalidation | Active session | 1. Manually invalidate auth token / clear session storage<br>2. Refresh page | App immediately redirects to `/login` without exposing sensitive data. | PASS |
| **TC-19** | Invalid Device ID | Test handling of non-existent device targets | Authenticated user | 1. Dispatch command targeting `dev-nonexistent-999` | Server returns `not-found` error; system gracefully alerts user. | PASS |
| **TC-20** | Multiple Registered Devices | Verify multi-device switching and isolation | 3+ enrolled devices | 1. Switch between Pixel 8, Galaxy S24, and OnePlus 12 in navbar dropdown | Active device state, map coordinates, and telemetry instantly switch without cross-contamination. | PASS |

---

## Step-by-Step Interactive Evaluation Procedure

### Evaluating in Standalone Cyber Simulator Mode:
1. Launch the web application:
   ```bash
   cd web
   npm run dev
   ```
2. Open `http://localhost:5173` in any modern web browser.
3. The dashboard loads immediately with pre-configured owner credentials and live phone companion simulator.
4. Test Remote Controls:
   - Click **"Sound Alarm"**: Note the audible alternating siren synthesized in your browser and the red strobe on the phone mockup!
   - Click **"Request GPS"**: Watch the command terminal log the handshake and the Leaflet map update with pinpoint accuracy!
   - Navigate to **"Custom Lost Message"**: Type a new message and watch the phone mockup update letter-by-letter in real time!
   - Click **"Save & Activate Lost Mode"**: The phone mockup locks into emergency mode with the single-tap owner dialer!
   - In the phone mockup, enter PIN `1234` to test local deactivation!
   - In the simulator drawer (top slider icon), click **"Simulate SIM Eject"** and navigate to **"Security Center"** to see the smart threat detection engine catch the incident!
