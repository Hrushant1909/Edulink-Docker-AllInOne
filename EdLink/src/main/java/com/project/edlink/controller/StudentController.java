package com.project.edlink.controller;


import com.project.edlink.dto.ApiResponse;
import com.project.edlink.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {


    @Autowired
    private SubjectService subjectService;

    // Get subjects by standard
    @GetMapping("/subjects/{standard}")
    public ResponseEntity<ApiResponse> getSubjectsByStandard(@PathVariable String standard) {

        return ResponseEntity.ok(
                new ApiResponse("Subjects fetched", subjectService.getSubjectsByStandard(standard))
        );
    }

    @PostMapping("/subjects/enroll")
    public ResponseEntity<ApiResponse> enrollStudent(
            @RequestParam Long subjectId,
            @RequestParam String enrollmentKey) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        String message = subjectService.enrollStudent(email, subjectId, enrollmentKey);

        return ResponseEntity.ok(new ApiResponse(message, null));
    }

    @GetMapping("/subjects/enrolled")
    public ResponseEntity<ApiResponse> getEnrolledSubjects() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(
                new ApiResponse("Enrolled subjects fetched", subjectService.getEnrolledSubjects(email))
        );
    }

}
