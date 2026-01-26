package com.project.edlink.dto;

public class ChatParticipantDto {

    private Long userId;
    private String name;
    private String role;
    private boolean online;

    public ChatParticipantDto() {
    }

    public ChatParticipantDto(Long userId, String name, String role, boolean online) {
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.online = online;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}


