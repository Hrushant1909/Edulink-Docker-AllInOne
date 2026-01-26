package com.project.edlink.repository;

import com.project.edlink.entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudentId(Long studentId);

    List<Enrollment> findBySubjectId(Long subjectId);

    long countBySubjectId(Long subjectId);

    boolean existsByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
