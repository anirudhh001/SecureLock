# 🛡️ SecureLock: Remote Device Defense & Lost Mode Console

[![Cybersecurity Capstone](https://img.shields.io/badge/Security-Enterprise%20Zero--Trust-cyan.svg)](#)
[![Android Compatibility](https://img.shields.io/badge/Android-10%20to%2014%20(API%2034)-emerald.svg)](#)
[![Cloud Backend](https://img.shields.io/badge/Backend-Firebase%20%7C%20Firestore%20%7C%20Cloud%20Functions-amber.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Tailwind-blue.svg)](#)

> **SecureLock** is an enterprise-grade, web-based cybersecurity project that allows an authenticated owner to remotely monitor, locate, and safeguard their registered Android smartphone from a modern, responsive cybersecurity console.

---

## 🌟 Key Highlights & Architectural Strengths

- **🔐 Zero-Bypass Ethical Architecture**: Built in strict adherence to official Android Device Administration APIs (`DevicePolicyManager.lockNow()`) and Fused Location Provider APIs. Zero rooting, zero stealth malware, and zero lockscreen bypasses.
- **📱 Custom Lost-Mode Message Studio**: Real-time WYSIWYG editor allowing the owner to customize emergency banners, cash reward promises, and recovery phone numbers displayed across the phone's locked screen with single-tap dialer support.
- **🚨 Audible Emergency Siren Synthesizer**: Overrides Android silent/vibrate profiles at 100% volume, backed by a Web Audio API dual-frequency synthesizer in the browser.
- **📍 Real-Time Spatial Mapping**: Interactive OpenStreetMap / Leaflet integration with pulsing radar pinpoints, dynamic accuracy error circles (±6m), and historical breadcrumb trails.
- **⚡ Smart Threat Detection Heuristics**: Monitors accessible Android hardware broadcasts (SIM card removal `ACTION_SIM_CARD_STATE_CHANGED`, airplane mode toggling, battery depletion, and failed lockscreen PIN attempts).
- **📋 Immutable Cryptographic Audit Log**: Records every command, packet signature, and threat alert with tamper-proof Firestore Security Rules.
- **🧪 Interactive Android Companion Simulator**: Built directly into the web dashboard, enabling instantaneous end-to-end evaluation without requiring an external physical Android phone.

---

## 🏗️ System Architecture

```
                          SECURELOCK WEB DASHBOARD
                                    │
                                    ▼
                         Firebase Authentication
                                    │
                                    ▼
                         Cloud Firestore Database
                                    │
                         Verified Security Rules
                                    │
                                    ▼
                   Firebase Cloud Functions (Backend)
                                    │
                   FCM High-Priority Data Payloads
                                    │
                                    ▼
                         ANDROID COMPANION APP
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   Location Service           Alarm Service            Lost Mode Engine
(FusedLocationProvider)    (STREAM_ALARM Override)    (Fullscreen Locked)
                                                              │
                                                              ▼
                                                   Custom Recovery Message
```

---

## 💻 13 Cybersecurity Dashboard Pages

| # | Page / Module | Route | Functionality |
|---|---|---|---|
| 1 | **Login** | `/login` | Email/password sign-in, instant demo login shortcut, Google OAuth, password reset |
| 2 | **Register** | `/register` | Strong password enforcement, password meter, ethical use certification |
| 3 | **Email Verification** | `/verify-email` | Owner identity verification workflow & resend dispatch |
| 4 | **Dashboard Overview** | `/dashboard` | Hardware telemetry, online/offline status, quick actions, threat stream |
| 5 | **My Devices** | `/devices` | Enrolled device inventory, QR code & pairing token generator, unenrollment |
| 6 | **Device Details** | `/devices/:id` | Low-level OS specs, patch level, battery health/temp, storage metrics |
| 7 | **Location Tracking** | `/location` | Interactive Leaflet OpenStreetMap, GPS coordinates, breadcrumb trail |
| 8 | **Remote Controls** | `/controls` | Trigger siren, poll GPS, invoke remote lock, audit command terminal |
| 9 | **Lost Mode** | `/lost-mode` | Emergency lockdown state, mobile preview, single-click disarm |
| 10 | **Custom Lost Message** | `/lost-message` | WYSIWYG message editor, preset templates, emergency dialer, PIN config |
| 11 | **Security Center** | `/security` | Smart threat detection matrix, alert severity breakdown, threat injector |
| 12 | **Event History** | `/history` | Filterable audit trail table, JSON/CSV export, SHA-256 integrity hashes |
| 13 | **Account Settings** | `/settings` | Owner identity, Firebase key configuration, policy compliance report |

---

## 🚀 Quick Start & Interactive Evaluation

### 1. Launch Web Dashboard (Standalone Simulator Mode)
The application is pre-configured with a live interactive cyber engine that works immediately:
```bash
cd web
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

> [!TIP]
> **Instant Review**: Click **"Instant Review Login"** on the login screen to enter immediately. The interactive Android Companion Phone simulator will appear on the bottom-right, reacting in real time to your commands!

### 2. Testing Commands in Real Time:
1. **Trigger Alarm**: Click **"Sound Alarm"** on the Dashboard or Remote Controls page. Hear the siren play through your browser and see the companion phone screen strobe red!
2. **Engage Lost Mode**: Navigate to **"Custom Lost Message"**, edit the text, and click **"Save & Activate Lost Mode"**. The phone simulator instantly locks and displays your customized message and contact number!
3. **Local PIN Unlock**: Enter `1234` on the phone mockup to unlock it locally!
4. **Threat Detection**: Click the slider icon at the top of the phone mockup and choose **"Simulate SIM Eject"**. Head to **Security Center** to observe the smart threat detection engine catch the incident!

---

## 📱 Android Companion App Setup (Physical Phone)

The Android companion application source code is located in `android/`:
1. Open `android/` in **Android Studio**.
2. Add your `google-services.json` to `android/app/`.
3. Connect your Android device (Android 10 to 14+) with USB Debugging enabled.
4. Click **Run 'app'**.
5. On the phone, accept **Device Administrator** privileges and **Location** permissions.
6. Enter the pairing token generated in your web dashboard.

---

## 🔒 Firestore Security Rules Summary

Located in `firebase/firestore.rules`:
- **Strict Device Ownership**: Users can only query and command devices where `ownerId == request.auth.uid`.
- **Anti-Hijacking**: Modifying the `ownerId` of an existing device document is strictly blocked.
- **Immutable Audit Trail**: `securityEvents` can be written by verified owners, but updates and deletions are disallowed (`allow update, delete: if false;`).

---

## 📚 Project Documentation

- [System Architecture Specification](docs/ARCHITECTURE.md)
- [Android Security Boundaries & Limitations Report](docs/ANDROID_LIMITATIONS_AND_PERMISSIONS.md)
- [Comprehensive Testing Matrix (20 Test Cases)](docs/TESTING_GUIDE.md)
- [Cloud & Android Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

---

## ⚖️ Ethical Disclosure & Academic Statement

SecureLock is designed as a college cybersecurity capstone demonstration. It enforces explicit user authorization, transparent foreground notifications, and strict adherence to Android OS privacy policies. It does not contain spyware, stealth keyloggers, or unauthorized surveillance mechanisms.
