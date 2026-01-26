package com.project.edlink.repository;

import com.project.edlink.entities.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {

    List<StudyMaterial> findBySubjectId(Long subjectId);
}
