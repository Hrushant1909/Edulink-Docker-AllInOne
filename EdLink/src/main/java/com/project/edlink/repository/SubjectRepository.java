package com.project.edlink.repository;

import com.project.edlink.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByTeacherId(Long teacherId);

    List<Subject> findByStandard(String standard);
}
