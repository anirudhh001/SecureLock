package com.securelock.companion.util

import android.content.Context
import android.content.SharedPreferences
import java.util.UUID

/**
 * Manages device-local security state, cryptographic identifiers,
 * pairing tokens, and Lost-Mode cached settings.
 */
class SecurityPreferences(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREFS_NAME = "securelock_security_prefs"
        private const val KEY_DEVICE_ID = "device_id"
        private const val KEY_OWNER_ID = "owner_id"
        private const val KEY_FCM_TOKEN = "fcm_token"
        private const val KEY_LOST_MODE = "lost_mode_active"
        private const val KEY_LOST_MESSAGE = "lost_mode_message"
        private const val KEY_RECOVERY_CONTACT = "recovery_contact"
        private const val KEY_RECOVERY_NOTES = "recovery_notes"
        private const val KEY_OWNER_PIN = "owner_pin"
    }

    var deviceId: String
        get() {
            var id = prefs.getString(KEY_DEVICE_ID, null)
            if (id == null) {
                id = "dev-android-" + UUID.randomUUID().toString().substring(0, 8)
                prefs.edit().putString(KEY_DEVICE_ID, id).apply()
            }
            return id
        }
        set(value) = prefs.edit().putString(KEY_DEVICE_ID, value).apply()

    var ownerId: String?
        get() = prefs.getString(KEY_OWNER_ID, null)
        set(value) = prefs.edit().putString(KEY_OWNER_ID, value).apply()

    var fcmToken: String?
        get() = prefs.getString(KEY_FCM_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_FCM_TOKEN, value).apply()

    var isLostMode: Boolean
        get() = prefs.getBoolean(KEY_LOST_MODE, false)
        set(value) = prefs.edit().putBoolean(KEY_LOST_MODE, value).apply()

    var lostModeMessage: String
        get() = prefs.getString(KEY_LOST_MESSAGE, "This phone is reported lost. Please contact the owner.") ?: ""
        set(value) = prefs.edit().putString(KEY_LOST_MESSAGE, value).apply()

    var recoveryContact: String
        get() = prefs.getString(KEY_RECOVERY_CONTACT, "") ?: ""
        set(value) = prefs.edit().putString(KEY_RECOVERY_CONTACT, value).apply()

    var recoveryNotes: String
        get() = prefs.getString(KEY_RECOVERY_NOTES, "A reward is provided upon safe return.") ?: ""
        set(value) = prefs.edit().putString(KEY_RECOVERY_NOTES, value).apply()

    var ownerPin: String
        get() = prefs.getString(KEY_OWNER_PIN, "1234") ?: "1234"
        set(value) = prefs.edit().putString(KEY_OWNER_PIN, value).apply()
}
