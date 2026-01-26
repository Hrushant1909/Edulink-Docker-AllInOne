package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.dto.ForgotPasswordRequest;
import com.project.edlink.dto.LoginRequest;
import com.project.edlink.dto.ResetPasswordRequest;
import com.project.edlink.dto.SignupRequest;
import com.project.edlink.dto.VerifyOTPRequest;
import com.project.edlink.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/teacher/signup")
    public ResponseEntity<ApiResponse> teacherSignup(@RequestBody SignupRequest request) {

        String result = authService.registerTeacher(request);

        ApiResponse response = new ApiResponse(result, null);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/student/signup")
    public ResponseEntity<ApiResponse> studentSignup(@RequestBody SignupRequest request) {

        String result = authService.registerStudent(request);

        ApiResponse response = new ApiResponse(result, null);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for email: " + request.getEmail());
            
            String token = authService.login(request);

            if (token == null) {
                System.out.println("Login failed: Invalid credentials for " + request.getEmail());
                return new ResponseEntity<>(
                        new ApiResponse("Invalid credentials!", null),
                        HttpStatus.UNAUTHORIZED
                );
            }

            // Check if teacher is pending approval
            if (token.equals("PENDING_TEACHER")) {
                return new ResponseEntity<>(
                        new ApiResponse("Your account is pending admin approval. Please wait for approval before logging in.", null),
                        HttpStatus.FORBIDDEN
                );
            }

            System.out.println("Login successful for: " + request.getEmail());
            return new ResponseEntity<>(
                    new ApiResponse("Login successful", token),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            System.err.println("Login controller error: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(
                    new ApiResponse("An error occurred during login. Please try again.", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String result = authService.sendOTP(request.getEmail());
        
        if (result.contains("not found")) {
            return new ResponseEntity<>(
                    new ApiResponse(result, null),
                    HttpStatus.NOT_FOUND
            );
        }
        
        if (result.contains("Failed")) {
            return new ResponseEntity<>(
                    new ApiResponse(result, null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        
        return new ResponseEntity<>(
                new ApiResponse(result, null),
                HttpStatus.OK
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOTP(@RequestBody VerifyOTPRequest request) {
        String result = authService.verifyOTP(request.getEmail(), request.getOtp());
        
        if (result.contains("Invalid") || result.contains("expired")) {
            return new ResponseEntity<>(
                    new ApiResponse(result, null),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        return new ResponseEntity<>(
                new ApiResponse(result, null),
                HttpStatus.OK
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        String result = authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );
        
        if (result.contains("Invalid") || result.contains("expired") || result.contains("not found")) {
            return new ResponseEntity<>(
                    new ApiResponse(result, null),
                    HttpStatus.BAD_REQUEST
            );
        }
        
        return new ResponseEntity<>(
                new ApiResponse(result, null),
                HttpStatus.OK
        );
    }

    @GetMapping("/test-bcrypt")
    public String testBCrypt() {
        return passwordEncoder.matches("admin123",
                "$2a$10$i/1Iw2FjaMr4X8GL.uHHyuB7rl3YJwt92O0LTh7nVks8ipWDqyUoy")
                ? "MATCH" : "NOT MATCH";
    }
//
    @GetMapping("/gen")
    public String generateHash() {
        return passwordEncoder.encode("admin123");
    }
}