package com.allanpereiraabrahao.blog.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Map;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/posts/*/like").permitAll()
                .requestMatchers("/api/posts/*/comments").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginProcessingUrl("/api/auth/login")
                .successHandler((req, res, auth) -> {
                    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(res.getWriter(),
                            Map.of("username", auth.getName(),
                                   "role", auth.getAuthorities().iterator().next().getAuthority()));
                })
                .failureHandler((req, res, ex) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(res.getWriter(), Map.of("error", "Invalid credentials"));
                })
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(res.getWriter(), Map.of("message", "Logged out"));
                })
                .permitAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    new ObjectMapper().writeValue(res.getWriter(), Map.of("error", "Unauthorized"));
                })
            );
        return http.build();
    }
}
