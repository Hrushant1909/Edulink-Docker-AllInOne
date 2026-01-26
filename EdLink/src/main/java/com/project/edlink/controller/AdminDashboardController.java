package com.project.edlink.controller;

import com.project.edlink.dto.ApiResponse;
import com.project.edlink.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {

        return ResponseEntity.ok(
                new ApiResponse("Dashboard stats fetched successfully",
                        adminService.getDashboardStats())
        );
    }
}