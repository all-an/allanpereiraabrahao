package com.allanpereiraabrahao.blog.controller;

import com.allanpereiraabrahao.blog.model.User;
import com.allanpereiraabrahao.blog.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/password")
public class AdminPasswordController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminPasswordController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "currentPassword and newPassword are required"));
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("error", "Current password is incorrect"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
