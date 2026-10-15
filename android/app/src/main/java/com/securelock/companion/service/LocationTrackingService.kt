package com.securelock.companion.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.Service
import android.content.Intent
import android.location.Location
import android.os.IBinder
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.SecureLockApp
import com.securelock.companion.util.SecurityPreferences

/**
 * Foreground Location Tracking Service.
 * Implements Android 14 compliant high-accuracy location polling using FusedLocationProviderClient.
 * Strictly presents a persistent notification to honor Android privacy mandates.
 */
class LocationTrackingService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var locationCallback: LocationCallback? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.i(TAG, "Starting foreground location poll service...")
        startForeground(NOTIFICATION_ID, buildNotification())
        requestLocationUpdates()
        return START_NOT_STICKY
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, SecureLockApp.CHANNEL_LOCATION)
            .setContentTitle("SecureLock Guard Active")
            .setContentText("Owner requested high-accuracy location fix")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()
    }

    @SuppressLint("MissingPermission")
    private fun requestLocationUpdates() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 5000L).apply {
            setMinUpdateIntervalMillis(2000L)
            setMaxUpdates(3) // Capture accurate fix and stop to save battery
        }.build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val loc = locationResult.lastLocation ?: return
                Log.d(TAG, "High-accuracy GPS fix acquired: ${loc.latitude}, ${loc.longitude}")
                uploadLocationToFirestore(loc)
            }
        }

        fusedLocationClient.requestLocationUpdates(
            locationRequest,
            locationCallback!!,
            Looper.getMainLooper()
        )
    }

    private fun uploadLocationToFirestore(location: Location) {
        val prefs = SecurityPreferences(this)
        val deviceId = prefs.deviceId

        val locationPayload = hashMapOf(
            "latitude" to location.latitude,
            "longitude" to location.longitude,
            "accuracy" to location.accuracy,
            "altitude" to location.altitude,
            "speed" to location.speed,
            "timestamp" to FieldValue.serverTimestamp()
        )

        FirebaseFirestore.getInstance().collection("devices").document(deviceId)
            .update(
                mapOf(
                    "location" to locationPayload,
                    "lastSeen" to FieldValue.serverTimestamp()
                )
            )
            .addOnSuccessListener {
                Log.i(TAG, "Successfully synced GPS telemetry to Firestore.")
            }
            .addOnFailureListener { e ->
                Log.e(TAG, "Failed to upload GPS telemetry: ${e.message}")
            }
    }

    override fun onDestroy() {
        super.onDestroy()
        locationCallback?.let { fusedLocationClient.removeLocationUpdates(it) }
    }

    companion object {
        private const val TAG = "LocationService"
        private const val NOTIFICATION_ID = 2001
    }
}
