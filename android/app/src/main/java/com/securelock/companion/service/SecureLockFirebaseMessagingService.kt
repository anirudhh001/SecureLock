package com.securelock.companion.service

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.securelock.companion.LostModeActivity
import com.securelock.companion.receiver.SecureLockDeviceAdminReceiver
import com.securelock.companion.util.SecurityPreferences
import org.json.JSONObject

/**
 * Firebase Cloud Messaging Service.
 * Intercepts high-priority remote security commands from the SecureLock Web Dashboard:
 * - REQUEST_LOCATION: Launches FusedLocation tracking service
 * - RING_ALARM: Starts audible emergency siren override
 * - STOP_ALARM: Stops siren
 * - ACTIVATE_LOST_MODE: Launches fullscreen LostModeActivity with custom message
 * - DEACTIVATE_LOST_MODE: Restores normal companion state
 * - REMOTE_LOCK: Calls DevicePolicyManager.lockNow()
 */
class SecureLockFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.i(TAG, "New FCM Token received: $token")
        val prefs = SecurityPreferences(this)
        prefs.fcmToken = token

        // Sync token to device Firestore document if enrolled
        val deviceId = prefs.deviceId
        FirebaseFirestore.getInstance().collection("devices").document(deviceId)
            .update("fcmToken", token)
            .addOnFailureListener { e ->
                Log.w(TAG, "Failed to update FCM token in Firestore: ${e.message}")
            }
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        Log.i(TAG, "Remote message payload received from SecureLock: ${remoteMessage.data}")

        val data = remoteMessage.data
        val commandType = data["type"] ?: return
        val payloadStr = data["payload"]
        val payload = if (!payloadStr.isNullOrEmpty()) JSONObject(payloadStr) else JSONObject()

        executeCommand(commandType, payload)
    }

    private fun executeCommand(commandType: String, payload: JSONObject) {
        val prefs = SecurityPreferences(this)

        when (commandType) {
            "REQUEST_LOCATION" -> {
                Log.i(TAG, "Executing REQUEST_LOCATION command...")
                val intent = Intent(this, LocationTrackingService::class.java)
                ContextCompat.startForegroundService(this, intent)
            }

            "RING_ALARM" -> {
                Log.i(TAG, "Executing RING_ALARM command...")
                val intent = Intent(this, AlarmAudioService::class.java)
                startService(intent)
            }

            "STOP_ALARM" -> {
                Log.i(TAG, "Executing STOP_ALARM command...")
                val intent = Intent(this, AlarmAudioService::class.java)
                stopService(intent)
            }

            "ACTIVATE_LOST_MODE" -> {
                Log.i(TAG, "Executing ACTIVATE_LOST_MODE command...")
                val customMsg = payload.optString("customMessage", "This phone is reported lost.")
                val contact = payload.optString("recoveryContact", "")
                val notes = payload.optString("recoveryNotes", "")
                val pin = payload.optString("devicePin", "1234")

                prefs.isLostMode = true
                prefs.lostModeMessage = customMsg
                prefs.recoveryContact = contact
                prefs.recoveryNotes = notes
                prefs.ownerPin = pin

                // Launch Fullscreen Lost Mode Activity
                val intent = Intent(this, LostModeActivity::class.java).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                }
                startActivity(intent)
            }

            "DEACTIVATE_LOST_MODE" -> {
                Log.i(TAG, "Executing DEACTIVATE_LOST_MODE command...")
                prefs.isLostMode = false
                val intent = Intent(this, AlarmAudioService::class.java)
                stopService(intent)

                // Broadcast local intent to close LostModeActivity if open
                val closeIntent = Intent("com.securelock.ACTION_DISMISS_LOST_MODE")
                sendBroadcast(closeIntent)
            }

            "REMOTE_LOCK" -> {
                Log.i(TAG, "Executing REMOTE_LOCK via DevicePolicyManager.lockNow()...")
                val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
                val adminComponent = ComponentName(this, SecureLockDeviceAdminReceiver::class.java)

                if (dpm.isAdminActive(adminComponent)) {
                    dpm.lockNow()
                } else {
                    Log.w(TAG, "Device Administrator policy not active; cannot lock screen directly.")
                }
            }

            "STATUS_CHECK" -> {
                Log.i(TAG, "Executing STATUS_CHECK polling...")
                // Touch lastSeen in Firestore
                FirebaseFirestore.getInstance().collection("devices").document(prefs.deviceId)
                    .update("lastSeen", com.google.firebase.firestore.FieldValue.serverTimestamp())
            }
        }
    }

    companion object {
        private const val TAG = "FCMService"
    }
}
