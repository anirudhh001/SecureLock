package com.securelock.companion.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.util.SecurityPreferences

/**
 * Smart Threat Detection Receiver.
 * Monitors only permitted Android system broadcasts and accessible hardware states:
 * - Airplane mode toggle
 * - Battery depletion
 * - SIM card alterations
 * - Boot completion
 */
class ThreatDetectionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        Log.d(TAG, "Received system broadcast: $action")

        val prefs = SecurityPreferences(context)
        val ownerId = prefs.ownerId ?: return
        val deviceId = prefs.deviceId

        when (action) {
            Intent.ACTION_AIRPLANE_MODE_CHANGED -> {
                val state = intent.getBooleanExtra("state", false)
                val desc = if (state) {
                    "Airplane mode toggled ON. Device disconnected from cellular radios."
                } else {
                    "Airplane mode toggled OFF. Cellular connectivity restored."
                }
                recordThreat(deviceId, ownerId, "AIRPLANE_MODE_TOGGLED", "MEDIUM", desc)
            }

            Intent.ACTION_BATTERY_LOW -> {
                recordThreat(
                    deviceId, 
                    ownerId, 
                    "BATTERY_CRITICAL_LOW", 
                    "MEDIUM", 
                    "Battery critically low (<15%). Immediate telemetry beacon dispatched."
                )
            }

            "android.intent.action.SIM_CARD_STATE_CHANGED" -> {
                val simState = intent.getStringExtra("ss") ?: "UNKNOWN"
                recordThreat(
                    deviceId,
                    ownerId,
                    "SIM_STATE_CHANGED",
                    "HIGH",
                    "SIM card state altered to '$simState'. Possible SIM ejection or carrier change detected."
                )
            }

            Intent.ACTION_BOOT_COMPLETED -> {
                recordThreat(
                    deviceId,
                    ownerId,
                    "DEVICE_ONLINE",
                    "LOW",
                    "Device rebooted. SecureLock companion service re-initialized and standing guard."
                )
            }
        }
    }

    private fun recordThreat(deviceId: String, ownerId: String, type: String, severity: String, description: String) {
        try {
            val event = hashMapOf(
                "deviceId" to deviceId,
                "ownerId" to ownerId,
                "eventType" to type,
                "severity" to severity,
                "description" to description,
                "timestamp" to FieldValue.serverTimestamp(),
                "status" to "INVESTIGATING"
            )

            FirebaseFirestore.getInstance().collection("securityEvents").add(event)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to record threat event: ${e.message}")
        }
    }

    companion object {
        private const val TAG = "ThreatDetection"
    }
}
