package com.project.edlink.dto;

/**
 * DTO for presence update requests via WebSocket
 */
public class PresenceUpdateRequest {
    
    private Long subjectId;

    public PresenceUpdateRequest() {
    }

    public PresenceUpdateRequest(Long subjectId) {
        this.subjectId = subjectId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
}
