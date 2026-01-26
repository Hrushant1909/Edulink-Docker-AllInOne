package com.project.edlink.controller;

import com.project.edlink.dto.ChatMessageDto;
import com.project.edlink.dto.PresenceUpdateDto;
import com.project.edlink.dto.PresenceUpdateRequest;
import com.project.edlink.dto.WebSocketMessageRequest;
import com.project.edlink.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;


@Controller
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.send")
    public void sendMessage(@Payload WebSocketMessageRequest request, Principal principal) {
        // Get the authenticated user's email
        String email = principal.getName();
        
        // Save message to database
        ChatMessageDto messageDto = chatService.sendMessageViaWebSocket(
            email, 
            request.getSubjectId(), 
            request.getContent()
        );
        
        // Broadcast to all subscribers of this subject's chat
        messagingTemplate.convertAndSend(
            "/topic/chat." + request.getSubjectId(), 
            messageDto
        );
    }

    /**
     * Handle presence updates (when user is typing, online, etc.)
     * 
     * Client sends to: /app/presence.update
     * Updates are broadcast to: /topic/presence.{subjectId}
     * 
     * @param request The presence update request containing subjectId
     * @param principal The authenticated user
     */
    @MessageMapping("/presence.update")
    public void updatePresence(@Payload PresenceUpdateRequest request, Principal principal) {
        String email = principal.getName();
        Long subjectId = request.getSubjectId();
        
        // Update presence in database
        chatService.updatePresence(email, subjectId);
        
        // Get updated presence info and broadcast
        PresenceUpdateDto presenceUpdate = chatService.getPresenceUpdate(email, subjectId);
        
        if (presenceUpdate != null) {
            // Broadcast presence update to all subscribers
            messagingTemplate.convertAndSend(
                "/topic/presence." + subjectId, 
                presenceUpdate
            );
        }
    }
}
