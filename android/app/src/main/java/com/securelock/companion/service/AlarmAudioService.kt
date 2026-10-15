package com.securelock.companion.service

import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.IBinder
import android.os.PowerManager
import android.util.Log

/**
 * Foreground Audio Alarm Service.
 * Sounds an emergency siren at maximum volume overriding silent mode.
 */
class AlarmAudioService : Service() {

    private var ringtone: Ringtone? = null
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Starting remote siren audio alert...")

        // Acquire WakeLock to keep CPU active while sounding alarm
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "SecureLock:AlarmWakeLock").apply {
            acquire(5 * 60 * 1000L) // 5 minutes max
        }

        playAlarm()
        return START_NOT_STICKY
    }

    private fun playAlarm() {
        try {
            val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            
            // Maximize volume for alarm stream
            val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM)
            audioManager.setStreamVolume(AudioManager.STREAM_ALARM, maxVolume, 0)

            // Select loud default alarm or ringtone URI
            var alarmUri: Uri? = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            if (alarmUri == null) {
                alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)
            }

            ringtone = RingtoneManager.getRingtone(applicationContext, alarmUri)?.apply {
                audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
                play()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error playing emergency alarm: ${e.message}")
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "Stopping remote siren audio alert...")
        try {
            ringtone?.stop()
            if (wakeLock?.isHeld == true) {
                wakeLock?.release()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping alarm: ${e.message}")
        }
    }

    companion object {
        private const val TAG = "AlarmAudioService"
    }
}
