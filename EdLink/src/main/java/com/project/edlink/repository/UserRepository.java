package com.project.edlink.repository;

import com.project.edlink.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByStatus(String status);
    long countByRole(String role);

    long countByRoleAndStatus(String role, String status);
}