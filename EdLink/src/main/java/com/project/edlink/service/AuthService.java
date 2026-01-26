package com.project.edlink.service;

import com.project.edlink.dto.LoginRequest;
import com.project.edlink.dto.SignupRequest;
import com.project.edlink.entities.User;
import com.project.edlink.repository.UserRepository;
import com.project.edlink.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OTPService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String registerTeacher(SignupRequest request) {

        // check if email exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("TEACHER");
        user.setStandard(null);
        user.setStatus("PENDING");

        userRepository.save(user);
        try{
            emailService.sendRegistrationMail(user.getEmail(), user.getName());
        }catch(Exception e){
            System.err.println("Error sending mail!!"+e.getMessage());
        }
        return "Teacher registration request submitted!";
    }

    public String registerStudent(SignupRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("STUDENT");
        user.setStandard(request.getStandard());
        user.setStatus("APPROVED");

        userRepository.save(user);
        try{
            emailService.sendRegistrationMail(user.getEmail(),user.getName());
        }catch (Exception e){
            System.err.println("Failed to send registration email: "+e.getMessage());
        }
        return "Student registered successfully!";
    }

    public String login(LoginRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail()).orElse(null);

            if (user == null) {
                System.out.println("Login failed: User not found for email: " + request.getEmail());
                return null;
            }

            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            
            if (!passwordMatches) {
                System.out.println("Login failed: Password mismatch for email: " + request.getEmail());
                System.out.println("Stored password hash: " + user.getPassword());
                return null;
            }

            if (user.getRole().equals("TEACHER") && !user.getStatus().equals("APPROVED")) {
                // Return a special indicator for pending teacher
                return "PENDING_TEACHER";
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            System.out.println("Login successful for: " + request.getEmail() + " with role: " + user.getRole());
            return token;
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public String sendOTP(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Email not found!";
        }

        String otp = otpService.generateOTP();
        otpService.storeOTP(email, otp);
        
        try {
            emailService.sendOTPEmail(email, otp);
            return "OTP sent successfully to your email!";
        } catch (Exception e) {
            return "Failed to send OTP. Please try again.";
        }
    }

    public String verifyOTP(String email, String otp) {
        if (otpService.verifyOTP(email, otp)) {
            return "OTP verified successfully!";
        }
        return "Invalid or expired OTP!";
    }

    public String resetPassword(String email, String otp, String newPassword) {
        // Verify OTP first
        if (!otpService.verifyOTP(email, otp)) {
            return "Invalid or expired OTP!";
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "User not found!";
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Remove OTP after successful password reset
        otpService.removeOTP(email);

        return "Password reset successfully!";
    }

}
