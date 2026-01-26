package com.project.edlink.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long subjectId;
    private String title;
    private String filePath;
    private String fileType;

    private LocalDateTime uploadDate;

    public StudyMaterial() {
        super();
    }
// getters + setters

    public StudyMaterial(Long id, Long subjectId, String title, String filePath, String fileType, LocalDateTime uploadDate) {
        this.id = id;
        this.subjectId = subjectId;
        this.title = title;
        this.filePath = filePath;
        this.fileType = fileType;
        this.uploadDate = uploadDate;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}
