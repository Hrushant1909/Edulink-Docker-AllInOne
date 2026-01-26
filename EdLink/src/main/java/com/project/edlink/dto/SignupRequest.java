package com.project.edlink.dto;

public class SignupRequest {

    private String name;
    private String email;
    private String password;
    private String role;
    private String standard; // only for students

    // getters + setters

    public SignupRequest() {
        super();
    }

    public SignupRequest(String name, String email, String password, String role, String standard) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.standard = standard;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStandard() {
        return standard;
    }

    public void setStandard(String standard) {
        this.standard = standard;
    }
}