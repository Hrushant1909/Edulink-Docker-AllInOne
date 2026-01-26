package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.entities.User;
import com.project.edlink.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/teachers/pending")
    public ResponseEntity<ApiResponse> getPendingTeachers() {
        List<User> list = adminService.getPendingTeachers();
        ApiResponse response = new ApiResponse("Pending teachers fetched.", list);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/teacher/approve/{id}")
    public ResponseEntity<ApiResponse> approveTeacher(@PathVariable Long id) {

        String result = adminService.approveTeacher(id);
        ApiResponse response = new ApiResponse(result, null);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/teacher/reject/{id}")
    public ResponseEntity<ApiResponse> rejectTeacher(@PathVariable Long id) {

        String result = adminService.rejectTeacher(id);
        ApiResponse response = new ApiResponse(result, null);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}