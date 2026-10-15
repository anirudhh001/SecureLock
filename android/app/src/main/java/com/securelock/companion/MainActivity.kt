package com.securelock.companion

import android.Manifest
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.databinding.ActivityMainBinding
import com.securelock.companion.receiver.SecureLockDeviceAdminReceiver
import com.securelock.companion.util.SecurityPreferences

/**
 * Android Companion Setup & Enrollment Activity.
 * Orchestrates legitimate owner consent, Device Admin privilege requests,
 * and device enrollment to Firestore.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: SecurityPreferences
    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var adminComponent: ComponentName

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        updateStatusChecklist()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = SecurityPreferences(this)
        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(this, SecureLockDeviceAdminReceiver::class.java)

        setupViews()
        requestAppPermissions()
    }

    override fun onResume() {
        super.onResume()
        updateStatusChecklist()
    }

    private fun setupViews() {
        binding.tvDeviceId.text = "Device ID: ${prefs.deviceId}"
        binding.tvOwnerUid.text = "Linked Owner: ${prefs.ownerId ?: "Not Paired"}"

        // Enroll Device Button
        binding.btnAuthorizeDevice.setOnClickListener {
            val token = binding.etPairingToken.text.toString().trim()
            if (token.isEmpty()) {
                Toast.makeText(this, "Please enter enrollment code from Web Dashboard", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // In production, token is exchanged for owner UID via Cloud Function
            prefs.ownerId = "usr-cyber-owner-01"
            enrollDeviceToFirestore()
        }

        // Grant Device Admin Button
        binding.btnGrantAdmin.setOnClickListener {
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
                putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent)
                putExtra(
                    DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    "SecureLock requires Device Administrator privileges to lock this phone remotely when reported lost."
                )
            }
            startActivity(intent)
        }

        // Grant Location Button
        binding.btnGrantLocation.setOnClickListener {
            requestAppPermissions()
        }

        // Test Local Lost Mode
        binding.btnTestLostMode.setOnClickListener {
            val intent = Intent(this, LostModeActivity::class.java)
            startActivity(intent)
        }
    }

    private fun requestAppPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }

        permissionLauncher.launch(permissions.toTypedArray())
    }

    private fun updateStatusChecklist() {
        val isAdmin = devicePolicyManager.isAdminActive(adminComponent)
        if (isAdmin) {
            binding.tvAdminStatus.text = "Device Admin Policy: ACTIVE (Authorized)"
            binding.btnGrantAdmin.isEnabled = false
            binding.btnGrantAdmin.text = "Granted"
        } else {
            binding.tvAdminStatus.text = "Device Admin Policy: INACTIVE"
            binding.btnGrantAdmin.isEnabled = true
            binding.btnGrantAdmin.text = "Enable"
        }

        val hasLocation = ContextCompat.checkSelfPermission(
            this, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (hasLocation) {
            binding.tvLocationStatus.text = "Location API: GRANTED (High Accuracy)"
            binding.btnGrantLocation.isEnabled = false
            binding.btnGrantLocation.text = "Granted"
        } else {
            binding.tvLocationStatus.text = "Location API: DENIED"
            binding.btnGrantLocation.isEnabled = true
            binding.btnGrantLocation.text = "Grant"
        }
    }

    private fun enrollDeviceToFirestore() {
        val deviceId = prefs.deviceId
        val ownerId = prefs.ownerId ?: return

        val deviceDoc = hashMapOf(
            "deviceId" to deviceId,
            "ownerId" to ownerId,
            "deviceName" to "${Build.MANUFACTURER} ${Build.MODEL}",
            "status" to "online",
            "lastSeen" to FieldValue.serverTimestamp(),
            "fcmToken" to (prefs.fcmToken ?: ""),
            "lostMode" to false,
            "lostModeMessage" to "This phone is reported lost. Please contact owner.",
            "recoveryContact" to "+1 (555) 019-2834",
            "specs" to hashMapOf(
                "model" to Build.MODEL,
                "manufacturer" to Build.MANUFACTURER,
                "osVersion" to "Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})",
                "apiLevel" to Build.VERSION.SDK_INT,
                "securityPatchLevel" to (Build.VERSION.SECURITY_PATCH ?: "Unknown"),
                "deviceAdminEnabled" to devicePolicyManager.isAdminActive(adminComponent)
            ),
            "createdAt" to FieldValue.serverTimestamp()
        )

        FirebaseFirestore.getInstance().collection("devices").document(deviceId)
            .set(deviceDoc)
            .addOnSuccessListener {
                Toast.makeText(this, "Device successfully linked to Owner Console!", Toast.LENGTH_LONG).show()
                binding.tvOwnerUid.text = "Linked Owner: $ownerId"
            }
            .addOnFailureListener { e ->
                Toast.makeText(this, "Enrollment error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }
}
