package com.project.edlink.dto;

public class ForgotPasswordRequest {
    private String email;

    public ForgotPasswordRequest() {
        super();
    }

    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

