package com.project.edlink.service;

import com.project.edlink.entities.StudyMaterial;
import com.project.edlink.entities.Subject;
import com.project.edlink.entities.User;
import com.project.edlink.repository.EnrollmentRepository;
import com.project.edlink.repository.StudyMaterialRepository;
import com.project.edlink.repository.SubjectRepository;
import com.project.edlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudyMaterialService {

    @Autowired
    private StudyMaterialRepository materialRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public String uploadMaterial(String email, Long subjectId, MultipartFile file, String title) {

        // 1. Teacher verify
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Security: only subject owner can upload
        if (!subject.getTeacherId().equals(teacher.getId())) {
            return "You are not allowed to upload material for this subject!";
        }

        try {
            // 2. Define folder
            String folderPath = "uploads/" + subjectId;

            // Create folder if not present
            Files.createDirectories(Paths.get(folderPath));

            // 3. Create unique file name
            String originalName = file.getOriginalFilename();
            String uniqueName = System.currentTimeMillis() + "_" + originalName;

            // 4. Final path
            Path filePath = Paths.get(folderPath + "/" + uniqueName);

            // 5. Save file to disk
            Files.copy(file.getInputStream(), filePath);

            // 6. Save material record in DB
            StudyMaterial material = new StudyMaterial();
            material.setSubjectId(subjectId);
            material.setTitle(title);
            material.setFilePath(filePath.toString());
            material.setFileType(getFileExtension(originalName));
            material.setUploadDate(LocalDateTime.now());

            materialRepository.save(material);

            return "Material uploaded successfully!";

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload material!";
        }
    }

    private String getFileExtension(String name) {
        return name.substring(name.lastIndexOf('.') + 1);
    }

    public List<StudyMaterial> getMaterialsBySubject(Long subjectId) {
        return materialRepository.findBySubjectId(subjectId);
    }


    public List<StudyMaterial> getStudentMaterials(String email, Long subjectId) {

        // 1. Student fetch
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Long studentId = student.getId();

        // 2. Check enrollment
        boolean enrolled = enrollmentRepository.existsByStudentIdAndSubjectId(studentId, subjectId);

        if (!enrolled) {
            throw new RuntimeException("You are not enrolled in this subject!");
        }

        // 3. Get materials
        return materialRepository.findBySubjectId(subjectId);
    }


    public Resource downloadMaterial(Long materialId, String email) {

        // 1. Student check
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // 2. Material fetch
        StudyMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new RuntimeException("Material not found"));

        // 3. Enrollment check
        boolean enrolled = enrollmentRepository.existsByStudentIdAndSubjectId(
                student.getId(),
                material.getSubjectId()
        );

        if (!enrolled) {
            throw new RuntimeException("You are not enrolled in this subject!");
        }

        // 4. Load file from disk
        try {
            Path path = Paths.get(material.getFilePath());
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read the file!");
            }

        } catch (Exception e) {
            throw new RuntimeException("Error while downloading: " + e.getMessage());
        }
    }


}
