package com.project.edlink.service;

import com.project.edlink.dto.AdminDashboardResponse;
import com.project.edlink.entities.User;
import com.project.edlink.repository.StudyMaterialRepository;
import com.project.edlink.repository.SubjectRepository;
import com.project.edlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudyMaterialRepository materialRepository;

    public List<User> getPendingTeachers() {
        return userRepository.findByStatus("PENDING");
    }

    public String approveTeacher(Long id) {
        User teacher = userRepository.findById(id).orElse(null);

        if (teacher == null) {
            return "Teacher not found!";
        }

        if (!teacher.getRole().equals("TEACHER")) {
            return "User is not a teacher!";
        }

        try{
            emailService.sendTeacherApprovalEmail(teacher.getEmail(),teacher.getName());
        }catch(Exception e){
            System.err.println("Failed to send approval email");
        }

        teacher.setStatus("APPROVED");
        userRepository.save(teacher);

        return "Teacher approved successfully!";
    }

    public String rejectTeacher(Long id) {
        User teacher = userRepository.findById(id).orElse(null);

        if (teacher == null) {
            return "Teacher not found!";
        }

        if (!teacher.getRole().equals("TEACHER")) {
            return "User is not a teacher!";
        }

        teacher.setStatus("REJECTED");
        userRepository.save(teacher);

        try{
            emailService.sendTeacherRejectionEmail(teacher.getEmail(), teacher.getName());
        }catch (Exception e){
            System.err.println("Teacher rejection mail failed to send!!");
        }
        return "Teacher rejected successfully!";
    }

    public AdminDashboardResponse getDashboardStats() {

        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalTeachers(userRepository.countByRole("TEACHER"));
        response.setTotalStudents(userRepository.countByRole("STUDENT"));
        response.setTotalSubjects(subjectRepository.count());
        response.setTotalMaterials(materialRepository.count());
        response.setPendingTeachers(userRepository.countByRoleAndStatus("TEACHER", "PENDING"));

        return response;
    }

}