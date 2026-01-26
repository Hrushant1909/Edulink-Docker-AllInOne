package com.project.edlink.entities;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "chat_presence",
        uniqueConstraints = @UniqueConstraint(columnNames = {"subjectId", "userId"}))
public class ChatPresence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long subjectId;

    private Long userId;

    private Instant lastSeen;

    public ChatPresence() {
    }

    public ChatPresence(Long id, Long subjectId, Long userId, Instant lastSeen) {
        this.id = id;
        this.subjectId = subjectId;
        this.userId = userId;
        this.lastSeen = lastSeen;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Instant getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(Instant lastSeen) {
        this.lastSeen = lastSeen;
    }
}


