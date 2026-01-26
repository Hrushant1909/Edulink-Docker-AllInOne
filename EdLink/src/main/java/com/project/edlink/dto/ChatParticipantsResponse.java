package com.project.edlink.dto;

import java.util.List;

public class ChatParticipantsResponse {

    private int totalStudents;
    private int onlineStudents;
    private List<ChatParticipantDto> participants;

    public ChatParticipantsResponse() {
    }

    public ChatParticipantsResponse(int totalStudents, int onlineStudents, List<ChatParticipantDto> participants) {
        this.totalStudents = totalStudents;
        this.onlineStudents = onlineStudents;
        this.participants = participants;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getOnlineStudents() {
        return onlineStudents;
    }

    public void setOnlineStudents(int onlineStudents) {
        this.onlineStudents = onlineStudents;
    }

    public List<ChatParticipantDto> getParticipants() {
        return participants;
    }

    public void setParticipants(List<ChatParticipantDto> participants) {
        this.participants = participants;
    }
}


