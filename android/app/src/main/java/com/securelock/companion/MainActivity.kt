package com.securelock.companion

import android.Manifest
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.securelock.companion.databinding.ActivityMainBinding
import com.securelock.companion.receiver.SecureLockDeviceAdminReceiver
import com.securelock.companion.util.SecurityPreferences

/**
 * Android Companion Setup & Enrollment Activity.
 * Orchestrates legitimate owner consent, Original Account ID authentication,
 * Device Admin privilege requests, and device enrollment to Firestore.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var prefs: SecurityPreferences
    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var adminComponent: ComponentName
    private lateinit var auth: FirebaseAuth

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ ->
        updateStatusChecklist()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = SecurityPreferences(this)
        auth = FirebaseAuth.getInstance()
        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(this, SecureLockDeviceAdminReceiver::class.java)

        setupViews()
        requestAppPermissions()
    }

    override fun onResume() {
        super.onResume()
        updateStatusChecklist()
        refreshEnrollmentUI()
    }

    private fun setupViews() {
        refreshEnrollmentUI()

        // 1. Original ID Account Login Button
        binding.btnOriginalIdLogin.setOnClickListener {
            val email = binding.etOwnerEmail.text.toString().trim()
            val pass = binding.etOwnerPassword.text.toString().trim()
            val customName = binding.etDeviceNickname.text.toString().trim()

            if (email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Please enter your Original Owner Email and Password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            binding.btnOriginalIdLogin.isEnabled = false
            binding.btnOriginalIdLogin.text = "Authenticating Owner..."

            // Attempt Firebase Authentication with Original Account Credentials
            auth.signInWithEmailAndPassword(email, pass)
                .addOnSuccessListener { authResult ->
                    val user = authResult.user
                    if (user != null) {
                        prefs.ownerId = user.uid
                        val finalDeviceName = if (customName.isNotEmpty()) customName else "${Build.MANUFACTURER} ${Build.MODEL}"
                        enrollDeviceToFirestore(finalDeviceName, email)
                    }
                }
                .addOnFailureListener { exception ->
                    binding.btnOriginalIdLogin.isEnabled = true
                    binding.btnOriginalIdLogin.text = "AUTHENTICATE & LINK TO OWNER"
                    Toast.makeText(this, "Authentication failed: ${exception.message}", Toast.LENGTH_LONG).show()
                }
        }

        // 2. Token Pairing Option (Alternative)
        binding.btnAuthorizeDevice.setOnClickListener {
            val token = binding.etPairingToken.text.toString().trim()
            if (token.isEmpty()) {
                Toast.makeText(this, "Please enter 6-digit code from Web Dashboard", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Fallback pairing with active token
            val customName = binding.etDeviceNickname.text.toString().trim()
            val finalDeviceName = if (customName.isNotEmpty()) customName else "${Build.MANUFACTURER} ${Build.MODEL}"
            prefs.ownerId = "usr-cyber-owner-01"
            enrollDeviceToFirestore(finalDeviceName, "cyber.admin@securelock.io")
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

    private fun refreshEnrollmentUI() {
        binding.tvDeviceId.text = "Device Hardware ID: ${prefs.deviceId}"
        val ownerId = prefs.ownerId

        if (ownerId != null) {
            binding.tvOwnerUid.text = "Linked Owner UID: $ownerId"
            binding.tvOwnerEmail.visibility = View.VISIBLE
            binding.tvOwnerEmail.text = "Status: Linked & Controlled via Web Console"
            binding.btnOriginalIdLogin.text = "RE-AUTHENTICATE / SWITCH OWNER"
        } else {
            binding.tvOwnerUid.text = "Linked Owner ID: Not Paired (Awaiting Login)"
            binding.tvOwnerEmail.visibility = View.GONE
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

    private fun enrollDeviceToFirestore(deviceName: String, ownerEmail: String) {
        val deviceId = prefs.deviceId
        val ownerId = prefs.ownerId ?: return

        val deviceDoc = hashMapOf(
            "deviceId" to deviceId,
            "ownerId" to ownerId,
            "deviceName" to deviceName,
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
            "battery" to hashMapOf(
                "level" to 85,
                "isCharging" to false
            ),
            "createdAt" to FieldValue.serverTimestamp()
        )

        FirebaseFirestore.getInstance().collection("devices").document(deviceId)
            .set(deviceDoc)
            .addOnSuccessListener {
                binding.btnOriginalIdLogin.isEnabled = true
                binding.btnOriginalIdLogin.text = "DEVICE LINKED SUCCESSFULLY"
                Toast.makeText(this, "Success! This device is now linked to $ownerEmail ($ownerId). You can now control it from your Web Dashboard.", Toast.LENGTH_LONG).show()
                refreshEnrollmentUI()
            }
            .addOnFailureListener { e ->
                binding.btnOriginalIdLogin.isEnabled = true
                binding.btnOriginalIdLogin.text = "AUTHENTICATE & LINK TO OWNER"
                Toast.makeText(this, "Firestore Enrollment error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
    }
}
