package com.project.edlink.dto;

/**
 * DTO for presence updates via WebSocket
 * Broadcasts when a user's online/offline status changes
 */
public class PresenceUpdateDto {
    
    private Long userId;
    private Long subjectId;
    private String userName;
    private String role;
    private boolean online;

    public PresenceUpdateDto() {
    }

    public PresenceUpdateDto(Long userId, Long subjectId, String userName, String role, boolean online) {
        this.userId = userId;
        this.subjectId = subjectId;
        this.userName = userName;
        this.role = role;
        this.online = online;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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
