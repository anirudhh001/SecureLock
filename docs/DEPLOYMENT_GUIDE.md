# SecureLock Production Deployment & Setup Guide

This guide walks you through deploying the complete SecureLock cybersecurity project, including the Firebase Cloud backend, Android Companion APK, and Web Dashboard.

---

## 1. Firebase Project Setup

### A. Create Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Name your project (e.g. `securelock-defense-capstone`).
3. Enable or disable Google Analytics as desired and click **Create Project**.

### B. Enable Firebase Authentication
1. In the left sidebar, navigate to **Build > Authentication**.
2. Click **Get Started**.
3. Under **Sign-in method**, enable:
   - **Email/Password** (Enable both Email/Password and Email link if desired).
   - **Google** (Optional: Add support email and client credentials).

### C. Initialize Cloud Firestore
1. Navigate to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose your database location (e.g., `nam5 (us-central)`).
4. Select **Start in production mode** (we will deploy strict security rules next).

### D. Deploy Firestore Security Rules & Indexes
Install the Firebase CLI if you haven't already:
```bash
npm install -g firebase-tools
firebase login
```

From the `firebase/` directory:
```bash
cd firebase
firebase use --add <YOUR_FIREBASE_PROJECT_ID>
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 2. Firebase Cloud Functions Deployment

1. Navigate to the `firebase/functions` directory:
   ```bash
   cd firebase/functions
   npm install
   npm run build
   ```
2. Deploy functions to your project:
   ```bash
   firebase deploy --only functions
   ```
   This deploys `sendRemoteCommand` and `onSecurityEventCreated`.

---

## 3. Web Dashboard Deployment

### A. Environment Configuration
Create a `.env` file in the `web/` directory with your Firebase Web App credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```
*(Note: If you run without `.env`, SecureLock automatically starts in **Interactive Cyber Simulator Mode** with zero configuration required!)*

### B. Build and Preview Locally
```bash
cd web
npm install
npm run build
npm run preview
```
Visit `http://localhost:4173` to test the production build.

### C. Deploy to Firebase Hosting
```bash
cd ..
firebase deploy --only hosting
```

---

## 4. Android Companion App Deployment

### A. Prerequisites
- Android Studio Iguana / Jellyfish (or newer).
- Android SDK 34 (Android 14) installed.
- A physical Android device or Android Virtual Device (AVD) running API 26+.

### B. Download `google-services.json`
1. In Firebase Console, go to **Project Settings > General**.
2. Under **Your apps**, click **Add app** and select **Android**.
3. Enter the package name: `com.securelock.companion`
4. Download the `google-services.json` file.
5. Place `google-services.json` into:
   ```
   android/app/google-services.json
   ```

### C. Build & Install via Gradle
Connect your Android phone via USB with USB Debugging enabled, then run:
```bash
cd android
./gradlew installDebug
```
Or open the `android/` directory in Android Studio and click **Run 'app'** (Green Play button).

### D. Device Setup Steps on Phone:
1. Open **SecureLock Companion**.
2. Tap **Enable** next to Device Admin Policy and approve the administrator privileges.
3. Grant **Location** and **Notification** permissions when prompted.
4. Enter the Pairing Token generated in your Web Dashboard.
5. Your phone is now secured and streaming telemetry!
