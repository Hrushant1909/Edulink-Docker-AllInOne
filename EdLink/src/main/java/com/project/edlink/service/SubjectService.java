package com.project.edlink.service;

import com.project.edlink.entities.Enrollment;
import com.project.edlink.entities.Subject;
import com.project.edlink.entities.User;
import com.project.edlink.repository.EnrollmentRepository;
import com.project.edlink.repository.SubjectRepository;
import com.project.edlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Subject createSubject(String email, Subject subject) {
        // teacherId find karke subject assign
        User teacher = userRepository.findByEmail(email).orElseThrow();
        subject.setTeacherId(teacher.getId());
        return subjectRepository.save(subject);
    }

    public List<Subject> getTeacherSubjects(String email) {
        // teacherId se subjects fetch
        User teacher = userRepository.findByEmail(email).orElseThrow();
        List<Subject> subjects = subjectRepository.findByTeacherId(teacher.getId());
        return subjects;
    }

    public List<Subject> getSubjectsByStandard(String standard) {
        return subjectRepository.findByStandard(standard);
    }

    public String enrollStudent(String email, Long subjectId, String key) {

        // 1. Student find
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found!"));

        // 2. Subject find
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found!"));

        // 3. enrollment key check
        if (!subject.getEnrollmentKey().equals(key)) {
            return "Invalid enrollment key!";
        }

        // 4. Already enrolled?
        boolean exists = enrollmentRepository.existsByStudentIdAndSubjectId(student.getId(), subjectId);

        if (exists) {
            return "You are already enrolled in this subject!";
        }

        // 5. Enroll student
        Enrollment e = new Enrollment();
        e.setStudentId(student.getId());
        e.setSubjectId(subjectId);

        enrollmentRepository.save(e);

        return "Enrollment successful!";
    }


    public List<Subject> getEnrolledSubjects(String email) {

        // 1. Student fetch
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found!"));

        // 2. Get enrollment list
        List<Enrollment> enrolled = enrollmentRepository.findByStudentId(student.getId());

        // 3. Convert enrollment → subjects
        List<Subject> subjects = new ArrayList<>();

        for (Enrollment e : enrolled) {
            subjectRepository.findById(e.getSubjectId())
                    .ifPresent(subjects::add);
        }

        return subjects;
    }

}
