package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.entities.Subject;
import com.project.edlink.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    @Autowired
    private SubjectService subjectService;

    @PostMapping("/subject/create")
    public ResponseEntity<ApiResponse> createSubject(@RequestBody Subject subject) {

        // JWT se email nikalna
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Subject saved = subjectService.createSubject(email, subject);
        return ResponseEntity.ok(new ApiResponse("Subject created successfully", saved));
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse> getTeacherSubjects() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(
                new ApiResponse("Subjects fetched", subjectService.getTeacherSubjects(email))
        );
    }

}
