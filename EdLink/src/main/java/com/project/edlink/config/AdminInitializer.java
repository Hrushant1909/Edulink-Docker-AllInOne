package com.project.edlink.config;

import com.project.edlink.entities.User;
import com.project.edlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@edulink.com").isEmpty()) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@edulink.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStandard(null);
            admin.setStatus("APPROVED");

            userRepository.save(admin);
            System.out.println("Default Admin Created Successfully!");
            System.out.println("Email: admin@edulink.com");
            System.out.println("Password: admin123");
        }
    }
}