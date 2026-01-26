package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.service.StudyMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/teacher/materials")
public class TeacherMaterialController {

    @Autowired
    private StudyMaterialService materialService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadMaterial(
            @RequestParam Long subjectId,
            @RequestParam String title,
            @RequestParam MultipartFile file) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        String message = materialService.uploadMaterial(email, subjectId, file, title);

        return ResponseEntity.ok(new ApiResponse(message, null));
    }



    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse> getMaterials(@PathVariable Long subjectId) {

        return ResponseEntity.ok(
                new ApiResponse("Materials fetched",
                        materialService.getMaterialsBySubject(subjectId))
        );
    }
}
