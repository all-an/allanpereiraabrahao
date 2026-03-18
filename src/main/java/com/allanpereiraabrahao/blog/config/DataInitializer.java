package com.allanpereiraabrahao.blog.config;

import com.allanpereiraabrahao.blog.model.User;
import com.allanpereiraabrahao.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @Bean
    public ApplicationRunner seedAdmin(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setPassword(encoder.encode(adminPassword));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Admin user created: " + adminUsername);
            }
        };
    }
}
