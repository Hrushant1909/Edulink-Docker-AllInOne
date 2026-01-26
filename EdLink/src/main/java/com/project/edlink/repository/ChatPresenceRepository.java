package com.project.edlink.repository;

import com.project.edlink.entities.ChatPresence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ChatPresenceRepository extends JpaRepository<ChatPresence, Long> {

    Optional<ChatPresence> findBySubjectIdAndUserId(Long subjectId, Long userId);

    List<ChatPresence> findBySubjectIdAndLastSeenAfter(Long subjectId, Instant activeAfter);
}


