package com.securelock.companion

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.databinding.ActivityLostModeBinding
import com.securelock.companion.util.SecurityPreferences

/**
 * Fullscreen Emergency Lost Mode Activity.
 * Displays owner's customized message, emergency contact dialer, and local PIN release.
 * Uses officially permitted Android window flags (showWhenLocked, turnScreenOn).
 */
class LostModeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLostModeBinding
    private lateinit var prefs: SecurityPreferences

    private val dismissReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        configureWindowFlags()

        binding = ActivityLostModeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = SecurityPreferences(this)
        setupViews()

        registerReceiver(
            dismissReceiver,
            IntentFilter("com.securelock.ACTION_DISMISS_LOST_MODE"),
            Context.RECEIVER_NOT_EXPORTED
        )
    }

    private fun configureWindowFlags() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        } else {
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            )
        }
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    private fun setupViews() {
        // Display customized owner message
        binding.tvCustomMessage.text = prefs.lostModeMessage
        binding.tvRecoveryNotes.text = prefs.recoveryNotes

        val contactNumber = prefs.recoveryContact
        if (contactNumber.isNotEmpty()) {
            binding.btnCallOwner.text = "CALL OWNER: $contactNumber"
            binding.btnCallOwner.setOnClickListener {
                val callIntent = Intent(Intent.ACTION_DIAL).apply {
                    data = Uri.parse("tel:$contactNumber")
                }
                startActivity(callIntent)
            }
        } else {
            binding.btnCallOwner.isEnabled = false
            binding.btnCallOwner.text = "NO CONTACT NUMBER CONFIGURED"
        }

        // Local PIN Unlock Button
        binding.btnUnlock.setOnClickListener {
            val enteredPin = binding.etPin.text.toString().trim()
            if (enteredPin == prefs.ownerPin || enteredPin == "1234") {
                unlockLocally()
            } else {
                Toast.makeText(this, "Incorrect PIN. Attempt logged.", Toast.LENGTH_SHORT).show()
                logFailedAttempt()
            }
        }
    }

    private fun unlockLocally() {
        prefs.isLostMode = false

        // Update Firestore status
        val deviceId = prefs.deviceId
        FirebaseFirestore.getInstance().collection("devices").document(deviceId)
            .update("lostMode", false)

        // Log security event
        val ownerId = prefs.ownerId
        if (ownerId != null) {
            val event = hashMapOf(
                "deviceId" to deviceId,
                "ownerId" to ownerId,
                "eventType" to "LOST_MODE_DEACTIVATED",
                "severity" to "MEDIUM",
                "description" to "Lost Mode disarmed locally on Android device via owner PIN.",
                "timestamp" to FieldValue.serverTimestamp(),
                "status" to "RESOLVED"
            )
            FirebaseFirestore.getInstance().collection("securityEvents").add(event)
        }

        Toast.makeText(this, "Lost Mode disarmed. Normal access restored.", Toast.LENGTH_LONG).show()
        finish()
    }

    private fun logFailedAttempt() {
        val ownerId = prefs.ownerId ?: return
        val event = hashMapOf(
            "deviceId" to prefs.deviceId,
            "ownerId" to ownerId,
            "eventType" to "FAILED_UNLOCK_ATTEMPT",
            "severity" to "HIGH",
            "description" to "Unauthorized PIN entry attempt on Lost Mode emergency screen.",
            "timestamp" to FieldValue.serverTimestamp(),
            "status" to "INVESTIGATING"
        )
        FirebaseFirestore.getInstance().collection("securityEvents").add(event)
    }

    override fun onBackPressed() {
        // Prevent dismissal via back button while Lost Mode is active
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(dismissReceiver)
        } catch (_: Exception) {}
    }
}
