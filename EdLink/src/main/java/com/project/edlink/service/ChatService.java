package com.project.edlink.service;

import com.project.edlink.dto.ChatMessageDto;
import com.project.edlink.dto.ChatParticipantDto;
import com.project.edlink.dto.ChatParticipantsResponse;
import com.project.edlink.dto.PresenceUpdateDto;
import com.project.edlink.entities.ChatMessage;
import com.project.edlink.entities.ChatPresence;
import com.project.edlink.entities.Enrollment;
import com.project.edlink.entities.Subject;
import com.project.edlink.entities.User;
import com.project.edlink.repository.ChatMessageRepository;
import com.project.edlink.repository.ChatPresenceRepository;
import com.project.edlink.repository.EnrollmentRepository;
import com.project.edlink.repository.SubjectRepository;
import com.project.edlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final long ONLINE_THRESHOLD_SECONDS = 60;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ChatPresenceRepository chatPresenceRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    private User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Subject getSubjectOrThrow(Long subjectId) {
        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    private boolean isTeacherOfSubject(User user, Subject subject) {
        return "TEACHER".equalsIgnoreCase(user.getRole()) &&
                subject.getTeacherId() != null &&
                subject.getTeacherId().equals(user.getId());
    }

    private boolean isStudentEnrolledInSubject(User user, Long subjectId) {
        if (!"STUDENT".equalsIgnoreCase(user.getRole())) {
            return false;
        }
        return enrollmentRepository.existsByStudentIdAndSubjectId(user.getId(), subjectId);
    }

    private void assertUserCanAccessSubjectChat(User user, Subject subject) {
        boolean teacher = isTeacherOfSubject(user, subject);
        boolean student = isStudentEnrolledInSubject(user, subject.getId());

        if (!teacher && !student) {
            throw new RuntimeException("You do not have access to this subject chat");
        }
    }

    public List<ChatMessageDto> getMessagesForSubject(String email, Long subjectId, Long afterId) {
        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        List<ChatMessage> messages;
        if (afterId != null) {
            messages = chatMessageRepository.findBySubjectIdAndIdGreaterThanOrderByIdAsc(subjectId, afterId);
        } else {
            messages = chatMessageRepository.findBySubjectIdOrderByIdAsc(subjectId);
        }

        if (messages.isEmpty()) {
            return new ArrayList<>();
        }

        // Preload all senders for this subject's messages
        List<Long> senderIds = messages.stream()
                .map(ChatMessage::getSenderId)
                .distinct()
                .toList();

        Map<Long, User> userMap = userRepository.findAllById(senderIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);

        return messages.stream()
                .map(msg -> {
                    User sender = userMap.get(msg.getSenderId());
                    String senderName = sender != null ? sender.getName() : "Unknown";
                    String senderRole = sender != null ? sender.getRole() : "";
                    boolean own = sender != null && sender.getId().equals(currentUser.getId());
                    String createdAt = msg.getCreatedAt() != null ? formatter.format(msg.getCreatedAt()) : null;

                    return new ChatMessageDto(
                            msg.getId(),
                            msg.getSubjectId(),
                            msg.getSenderId(),
                            senderName,
                            senderRole,
                            msg.getContent(),
                            createdAt,
                            own
                    );
                })
                .collect(Collectors.toList());
    }

    public ChatMessageDto sendMessage(String email, Long subjectId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }

        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        ChatMessage message = new ChatMessage();
        message.setSubjectId(subjectId);
        message.setSenderId(currentUser.getId());
        message.setContent(content.trim());
        message.setCreatedAt(Instant.now());

        ChatMessage saved = chatMessageRepository.save(message);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);
        String createdAt = saved.getCreatedAt() != null ? formatter.format(saved.getCreatedAt()) : null;

        return new ChatMessageDto(
                saved.getId(),
                saved.getSubjectId(),
                saved.getSenderId(),
                currentUser.getName(),
                currentUser.getRole(),
                saved.getContent(),
                createdAt,
                true
        );
    }

    public void updatePresence(String email, Long subjectId) {
        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        Instant now = Instant.now();
        Optional<ChatPresence> existing = chatPresenceRepository.findBySubjectIdAndUserId(subjectId, currentUser.getId());

        ChatPresence presence = existing.orElseGet(ChatPresence::new);
        presence.setSubjectId(subjectId);
        presence.setUserId(currentUser.getId());
        presence.setLastSeen(now);

        chatPresenceRepository.save(presence);
    }

    public ChatParticipantsResponse getParticipants(String email, Long subjectId) {
        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        // All enrolled students
        List<Enrollment> enrollments = enrollmentRepository.findBySubjectId(subjectId);
        List<Long> studentIds = enrollments.stream()
                .map(Enrollment::getStudentId)
                .toList();

        int totalStudents = studentIds.size();

        // Teacher + students
        List<Long> allUserIds = new ArrayList<>(studentIds);
        if (subject.getTeacherId() != null) {
            allUserIds.add(subject.getTeacherId());
        }

        Map<Long, User> userMap = userRepository.findAllById(allUserIds)
                .stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        // Online presence
        Instant activeAfter = Instant.now().minusSeconds(ONLINE_THRESHOLD_SECONDS);
        List<ChatPresence> activePresence = chatPresenceRepository.findBySubjectIdAndLastSeenAfter(subjectId, activeAfter);
        Map<Long, ChatPresence> presenceMap = activePresence.stream()
                .collect(Collectors.toMap(ChatPresence::getUserId, p -> p));

        List<ChatParticipantDto> participants = new ArrayList<>();
        int onlineStudents = 0;

        for (Long userId : allUserIds) {
            User user = userMap.get(userId);
            if (user == null) {
                continue;
            }
            boolean online = presenceMap.containsKey(userId);

            if ("STUDENT".equalsIgnoreCase(user.getRole()) && online) {
                onlineStudents++;
            }

            participants.add(new ChatParticipantDto(
                    user.getId(),
                    user.getName(),
                    user.getRole(),
                    online
            ));
        }

        return new ChatParticipantsResponse(totalStudents, onlineStudents, participants);
    }

    /**
     * Send message via WebSocket (real-time)
     * Similar to sendMessage but optimized for WebSocket broadcasting
     * The 'own' field will be determined by each client
     */
    public ChatMessageDto sendMessageViaWebSocket(String email, Long subjectId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Message content cannot be empty");
        }

        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        ChatMessage message = new ChatMessage();
        message.setSubjectId(subjectId);
        message.setSenderId(currentUser.getId());
        message.setContent(content.trim());
        message.setCreatedAt(Instant.now());

        ChatMessage saved = chatMessageRepository.save(message);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC);
        String createdAt = saved.getCreatedAt() != null ? formatter.format(saved.getCreatedAt()) : null;

        // Return DTO without 'own' flag - each client will determine this
        return new ChatMessageDto(
                saved.getId(),
                saved.getSubjectId(),
                saved.getSenderId(),
                currentUser.getName(),
                currentUser.getRole(),
                saved.getContent(),
                createdAt,
                false // Will be set by client based on their userId
        );
    }

    /**
     * Get presence update DTO for broadcasting via WebSocket
     * Used when user's online/offline status changes
     */
    public PresenceUpdateDto getPresenceUpdate(String email, Long subjectId) {
        User currentUser = getCurrentUser(email);
        Subject subject = getSubjectOrThrow(subjectId);
        assertUserCanAccessSubjectChat(currentUser, subject);

        // Check if user is currently online (within threshold)
        Instant activeAfter = Instant.now().minusSeconds(ONLINE_THRESHOLD_SECONDS);
        Optional<ChatPresence> presence = chatPresenceRepository.findBySubjectIdAndUserId(subjectId, currentUser.getId());
        
        boolean isOnline = presence.isPresent() && 
                          presence.get().getLastSeen() != null && 
                          presence.get().getLastSeen().isAfter(activeAfter);

        return new PresenceUpdateDto(
                currentUser.getId(),
                subjectId,
                currentUser.getName(),
                currentUser.getRole(),
                isOnline
        );
    }
}


