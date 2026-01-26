package com.project.edlink.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOTPEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@edulink.com");
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP - EduLink");
            message.setText("Your OTP for password reset is: " + otp + "\n\n" +
                    "This OTP is valid for 10 minutes.\n\n" +
                    "If you did not request this, please ignore this email.");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
    }

    public void sendRegistrationMail(String toMail, String teacherName){
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Edulink <noreply@edulink.com>");
            message.setTo(toMail);
            message.setSubject("Edulink Registration Received - Approval in Progress!!");
            message.setText(
                    "Dear " + teacherName + ",\n\n" +
                            "Thank you for registering with EduLink.\n\n" +
                            "We’re happy to inform you that your teacher registration has been successfully received. " +
                            "At the moment, your account is under review and awaiting approval from our Super Admin.\n\n" +
                            "This review process helps us ensure a secure and high-quality learning environment for all users on the platform.\n\n" +
                            "Once your account is approved, you will receive a confirmation email and will be able to log in and access all teacher features.\n\n" +
                            "Thank you for your patience and interest in joining EduLink.\n\n" +
                            "Kind regards,\n" +
                            "EduLink Team"
            );
            mailSender.send(message);
        }catch (Exception e){
            System.err.println("Error sending teacher approval email: "+e.getMessage());
            throw new RuntimeException("Failed to send teacher approval email");
        }
    }

    public void sendTeacherApprovalEmail(String toEmail, String teacherName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("EduLink <noreply@edulink.com>");
            message.setTo(toEmail);
            message.setSubject("Your EduLink Teacher Account Has Been Approved");

            message.setText(
                    "Dear " + teacherName + ",\n\n" +

                            "We’re pleased to let you know that your EduLink teacher account has been approved.\n\n" +

                            "You can now log in using your registered credentials and begin using the platform’s features designed for educators.\n\n" +

                            "We’re glad to have you as part of the EduLink community and look forward to your contribution.\n\n" +

                            "If you have any questions or need assistance, feel free to reach out to our support team.\n\n" +

                            "Best regards,\n" +
                            "EduLink Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending teacher approval email: " + e.getMessage());
            throw new RuntimeException("Failed to send teacher approval email");
        }
    }

    public void sendTeacherRejectionEmail(String toEmail, String teacherName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("EduLink <noreply@edulink.com>");
            message.setTo(toEmail);
            message.setSubject("Update on Your EduLink Teacher Registration");

            message.setText(
                    "Dear " + teacherName + ",\n\n" +

                            "Thank you for your interest in joining EduLink as a teacher and for taking the time to complete your registration.\n\n" +

                            "After careful review, we regret to inform you that your teacher account request has not been approved at this time.\n\n" +

                            "This decision may be based on factors such as profile details, verification requirements, or current platform guidelines. " +
                            "Please note that this does not reflect your abilities or experience as an educator.\n\n" +

                            "You are welcome to review your information and apply again in the future, should you wish to do so.\n\n" +

                            "We appreciate your interest in EduLink and wish you all the best in your professional endeavors.\n\n" +

                            "Kind regards,\n" +
                            "EduLink Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending teacher rejection email: " + e.getMessage());
            throw new RuntimeException("Failed to send teacher rejection email");
        }
    }

}

