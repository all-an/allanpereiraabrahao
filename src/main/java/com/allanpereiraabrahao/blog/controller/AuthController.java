package com.allanpereiraabrahao.blog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", userDetails.getUsername(),
                "role", userDetails.getAuthorities().iterator().next().getAuthority()
        ));
    }
}
