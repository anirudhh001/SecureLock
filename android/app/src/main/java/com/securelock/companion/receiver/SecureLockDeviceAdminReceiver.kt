package com.securelock.companion.receiver

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.util.SecurityPreferences

/**
 * Standard Android DeviceAdminReceiver.
 * Provides legitimate owner-authorized lockscreen invocation via DevicePolicyManager.lockNow()
 * and watches for failed unlock attempts or tampering.
 */
class SecureLockDeviceAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Log.i(TAG, "Device Administrator policy activated by owner.")
        logEvent(context, "DEVICE_ADMIN_ENABLED", "LOW", "Device Administrator policy activated by owner.")
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Log.w(TAG, "WARNING: Device Administrator policy deactivated!")
        logEvent(context, "DEVICE_ADMIN_REVOCATION_ATTEMPT", "CRITICAL", "Device Administrator privileges were revoked from SecureLock!")
    }

    override fun onPasswordFailed(context: Context, intent: Intent) {
        super.onPasswordFailed(context, intent)
        Log.w(TAG, "Failed lock screen authentication attempt detected.")
        logEvent(context, "FAILED_UNLOCK_ATTEMPT", "HIGH", "Incorrect lock screen passcode entered on device.")
    }

    private fun logEvent(context: Context, eventType: String, severity: String, description: String) {
        try {
            val prefs = SecurityPreferences(context)
            val ownerId = prefs.ownerId ?: return
            val deviceId = prefs.deviceId

            val event = hashMapOf(
                "deviceId" to deviceId,
                "ownerId" to ownerId,
                "eventType" to eventType,
                "severity" to severity,
                "description" to description,
                "timestamp" to FieldValue.serverTimestamp(),
                "status" to "INVESTIGATING"
            )

            FirebaseFirestore.getInstance().collection("securityEvents").add(event)
        } catch (e: Exception) {
            Log.e(TAG, "Error writing security event to Firestore: ${e.message}")
        }
    }

    companion object {
        private const val TAG = "SecureLockAdmin"
    }
}
