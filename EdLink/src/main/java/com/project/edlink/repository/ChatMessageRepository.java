package com.project.edlink.repository;

import com.project.edlink.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findBySubjectIdOrderByIdAsc(Long subjectId);

    List<ChatMessage> findBySubjectIdAndIdGreaterThanOrderByIdAsc(Long subjectId, Long id);
}


