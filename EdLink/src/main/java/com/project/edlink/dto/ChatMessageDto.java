package com.project.edlink.dto;

public class ChatMessageDto {

    private Long id;
    private Long subjectId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private String createdAt;
    private boolean own;

    public ChatMessageDto() {
    }

    public ChatMessageDto(Long id, Long subjectId, Long senderId, String senderName, String senderRole,
                          String content, String createdAt, boolean own) {
        this.id = id;
        this.subjectId = subjectId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.content = content;
        this.createdAt = createdAt;
        this.own = own;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isOwn() {
        return own;
    }

    public void setOwn(boolean own) {
        this.own = own;
    }
}


