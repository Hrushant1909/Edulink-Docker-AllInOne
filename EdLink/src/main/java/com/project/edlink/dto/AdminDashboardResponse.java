package com.project.edlink.dto;

public class AdminDashboardResponse {

    private long totalTeachers;
    private long totalStudents;
    private long totalSubjects;
    private long totalMaterials;
    private long pendingTeachers;

    // getters + setters

    public AdminDashboardResponse() {
        super();
    }

    public AdminDashboardResponse(long totalTeachers, long totalStudents, long totalSubjects, long totalMaterials, long pendingTeachers) {
        this.totalTeachers = totalTeachers;
        this.totalStudents = totalStudents;
        this.totalSubjects = totalSubjects;
        this.totalMaterials = totalMaterials;
        this.pendingTeachers = pendingTeachers;
    }

    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalSubjects() {
        return totalSubjects;
    }

    public void setTotalSubjects(long totalSubjects) {
        this.totalSubjects = totalSubjects;
    }

    public long getTotalMaterials() {
        return totalMaterials;
    }

    public void setTotalMaterials(long totalMaterials) {
        this.totalMaterials = totalMaterials;
    }

    public long getPendingTeachers() {
        return pendingTeachers;
    }

    public void setPendingTeachers(long pendingTeachers) {
        this.pendingTeachers = pendingTeachers;
    }
}