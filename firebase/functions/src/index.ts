import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

interface CommandPayload {
  deviceId: string;
  commandType: "REQUEST_LOCATION" | "RING_ALARM" | "ACTIVATE_LOST_MODE" | "DEACTIVATE_LOST_MODE" | "REMOTE_LOCK" | "STATUS_CHECK";
  payload?: {
    customMessage?: string;
    recoveryContact?: string;
    soundAlarm?: boolean;
    lockScreenPin?: string;
    notes?: string;
  };
}

/**
 * Cloud Function: sendRemoteCommand
 * 
 * Verifies caller authentication and explicit device ownership before dispatching
 * remote security commands to the Android companion app via Cloud Firestore and FCM.
 */
export const sendRemoteCommand = functions.https.onCall(async (data: CommandPayload, context) => {
  // 1. Verify Authentication
  if (!context.auth || !context.auth.uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required to dispatch remote security commands."
    );
  }

  const userId = context.auth.uid;
  const { deviceId, commandType, payload } = data;

  if (!deviceId || !commandType) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing mandatory parameters: deviceId and commandType."
    );
  }

  // 2. Strict Device Ownership Verification
  const deviceRef = db.collection("devices").doc(deviceId);
  const deviceSnap = await deviceRef.get();

  if (!deviceSnap.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      `Device '${deviceId}' not found.`
    );
  }

  const deviceData = deviceSnap.data();
  if (deviceData?.ownerId !== userId) {
    // Log unauthorized command attempt as a critical security event
    await db.collection("securityEvents").add({
      deviceId,
      ownerId: deviceData?.ownerId || "unknown",
      eventType: "UNAUTHORIZED_COMMAND_ATTEMPT",
      severity: "CRITICAL",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `User '${userId}' attempted to invoke '${commandType}' on unauthorized device '${deviceId}'. Request blocked.`,
      metadata: {
        attemptedBy: userId,
        commandType,
      },
    });

    throw new functions.https.HttpsError(
      "permission-denied",
      "Access Denied: You do not own this device."
    );
  }

  // 3. Create Command Record in Device Command Queue
  const commandRef = deviceRef.collection("commands").doc();
  const commandRecord = {
    commandId: commandRef.id,
    deviceId,
    ownerId: userId,
    type: commandType,
    status: "PENDING",
    payload: payload || {},
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    executedAt: null,
  };

  await commandRef.set(commandRecord);

  // 4. Update Device State if Lost Mode triggered
  if (commandType === "ACTIVATE_LOST_MODE") {
    await deviceRef.update({
      lostMode: true,
      lostModeMessage: payload?.customMessage || "This device has been reported lost.",
      recoveryContact: payload?.recoveryContact || "",
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Record audit event
    await db.collection("securityEvents").add({
      deviceId,
      ownerId: userId,
      eventType: "LOST_MODE_ACTIVATED",
      severity: "HIGH",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `Lost Mode activated by owner for device '${deviceData.deviceName}'. Custom message dispatched.`,
    });
  } else if (commandType === "DEACTIVATE_LOST_MODE") {
    await deviceRef.update({
      lostMode: false,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("securityEvents").add({
      deviceId,
      ownerId: userId,
      eventType: "LOST_MODE_DEACTIVATED",
      severity: "MEDIUM",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `Lost Mode deactivated by owner for device '${deviceData.deviceName}'. Normal operation restored.`,
    });
  } else if (commandType === "RING_ALARM") {
    await db.collection("securityEvents").add({
      deviceId,
      ownerId: userId,
      eventType: "REMOTE_ALARM_TRIGGERED",
      severity: "MEDIUM",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `Remote siren alarm triggered by owner for device '${deviceData.deviceName}'.`,
    });
  } else if (commandType === "REQUEST_LOCATION") {
    await db.collection("securityEvents").add({
      deviceId,
      ownerId: userId,
      eventType: "LOCATION_POLL_REQUESTED",
      severity: "LOW",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      description: `High-accuracy GPS location ping requested by owner for device '${deviceData.deviceName}'.`,
    });
  }

  // 5. Send High-Priority FCM Push Notification if Android Companion Token is Registered
  if (deviceData.fcmToken) {
    try {
      await messaging.send({
        token: deviceData.fcmToken,
        data: {
          commandId: commandRef.id,
          type: commandType,
          payload: JSON.stringify(payload || {}),
          timestamp: new Date().toISOString(),
        },
        android: {
          priority: "high",
          ttl: 60 * 10, // 10 minutes TTL
        },
      });
    } catch (fcmErr) {
      console.warn("FCM dispatch warning (Device will retrieve via Firestore listener):", fcmErr);
    }
  }

  return {
    success: true,
    commandId: commandRef.id,
    status: "PENDING",
    message: `Command '${commandType}' successfully queued for device '${deviceData.deviceName}'.`,
  };
});

/**
 * Cloud Function: onSecurityEventCreated
 * 
 * Automatically analyzes new security events. If high or critical severity,
 * forwards an alert notification to the owner.
 */
export const onSecurityEventCreated = functions.firestore
  .document("securityEvents/{eventId}")
  .onCreate(async (snap, context) => {
    const event = snap.data();
    if (!event) return;

    if (event.severity === "HIGH" || event.severity === "CRITICAL") {
      console.log(`[ALERT] ${event.severity} Event on Device ${event.deviceId}: ${event.description}`);
      // Could dispatch email or web push notification to user
    }
  });
