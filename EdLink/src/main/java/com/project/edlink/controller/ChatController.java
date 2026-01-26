package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.dto.ChatMessageDto;
import com.project.edlink.dto.ChatParticipantsResponse;
import com.project.edlink.dto.SendMessageRequest;
import com.project.edlink.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;


    @GetMapping("/subjects/{subjectId}/messages")
    public ResponseEntity<ApiResponse> getMessages(
            @PathVariable Long subjectId,
            @RequestParam(required = false) Long afterId
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ChatMessageDto> messages = chatService.getMessagesForSubject(email, subjectId, afterId);
        return ResponseEntity.ok(new ApiResponse("Messages fetched", messages));
    }


    @PostMapping("/subjects/{subjectId}/messages")
    public ResponseEntity<ApiResponse> sendMessage(
            @PathVariable Long subjectId,
            @RequestBody SendMessageRequest request
    )

    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ChatMessageDto message = chatService.sendMessage(email, subjectId, request.getContent());
        return ResponseEntity.ok(new ApiResponse("Message sent", message));
    }

    @PostMapping("/subjects/{subjectId}/presence/ping")
    public ResponseEntity<ApiResponse> pingPresence(@PathVariable Long subjectId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        chatService.updatePresence(email, subjectId);

        return ResponseEntity.ok(new ApiResponse("Presence updated", null));
    }



    @GetMapping("/subjects/{subjectId}/participants")
    public ResponseEntity<ApiResponse> getParticipants(@PathVariable Long subjectId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        ChatParticipantsResponse response = chatService.getParticipants(email, subjectId);
        return ResponseEntity.ok(new ApiResponse("Participants fetched", response));
    }
}


