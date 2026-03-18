package com.allanpereiraabrahao.blog.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Forwards all non-API, non-static routes to Angular's index.html
 * so Angular Router can handle client-side navigation.
 */
@RestController
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/{path:[^\\.]*}/**"})
    public ResponseEntity<Resource> spa(HttpServletRequest request) {
        Resource index = new ClassPathResource("static/index.html");
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(index);
    }
}
