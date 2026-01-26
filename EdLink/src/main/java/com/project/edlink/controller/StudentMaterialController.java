package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.service.StudyMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/materials")
public class StudentMaterialController {

    @Autowired
    private StudyMaterialService materialService;

    @GetMapping("/{subjectId}")
    public ResponseEntity<ApiResponse> getMaterials(@PathVariable Long subjectId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            return ResponseEntity.ok(
                    new ApiResponse("Materials fetched successfully",
                            materialService.getStudentMaterials(email, subjectId))
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }


    @GetMapping("/download/{materialId}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long materialId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            Resource resource = materialService.downloadMaterial(materialId, email);

            // content type auto detect
            String contentType = "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

}
