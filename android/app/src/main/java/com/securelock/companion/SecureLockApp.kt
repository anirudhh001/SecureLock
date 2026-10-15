package com.securelock.companion

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build

class SecureLockApp : Application() {

    companion object {
        const val CHANNEL_COMMANDS = "channel_securelock_commands"
        const val CHANNEL_LOCATION = "channel_securelock_location"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Command execution & alerts channel
            val commandChannel = NotificationChannel(
                CHANNEL_COMMANDS,
                "SecureLock Emergency Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical alerts for remote commands, Lost Mode, and owner siren alerts"
                enableVibration(true)
            }

            // Foreground location tracking channel
            val locationChannel = NotificationChannel(
                CHANNEL_LOCATION,
                "SecureLock Location Guard",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Foreground service notification for remote GPS tracking per Android 14 requirements"
            }

            notificationManager.createNotificationChannel(commandChannel)
            notificationManager.createNotificationChannel(locationChannel)
        }
    }
}
