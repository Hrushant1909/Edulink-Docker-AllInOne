package com.project.edlink.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OTPService {

    // Store OTPs temporarily (email -> OTP, expiry time)
    private final Map<String, OTPData> otpStore = new ConcurrentHashMap<>();
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int OTP_LENGTH = 6;

    public String generateOTP() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public void storeOTP(String email, String otp) {
        long expiryTime = System.currentTimeMillis() + (OTP_EXPIRY_MINUTES * 60 * 1000);
        otpStore.put(email, new OTPData(otp, expiryTime));
    }

    public boolean verifyOTP(String email, String otp) {
        OTPData otpData = otpStore.get(email);
        if (otpData == null) {
            return false;
        }
        
        // Check if OTP expired
        if (System.currentTimeMillis() > otpData.getExpiryTime()) {
            otpStore.remove(email);
            return false;
        }
        
        // Verify OTP
        if (otpData.getOtp().equals(otp)) {
            return true;
        }
        
        return false;
    }

    public void removeOTP(String email) {
        otpStore.remove(email);
    }

    private static class OTPData {
        private final String otp;
        private final long expiryTime;

        public OTPData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpiryTime() {
            return expiryTime;
        }
    }
}

