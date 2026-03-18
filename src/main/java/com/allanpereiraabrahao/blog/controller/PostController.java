package com.allanpereiraabrahao.blog.controller;

import com.allanpereiraabrahao.blog.model.Post;
import com.allanpereiraabrahao.blog.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> list() {
        return postService.findAll();
    }

    @GetMapping("/{slug}")
    public Post get(@PathVariable String slug) {
        return postService.findBySlug(slug);
    }

    @PostMapping("/{slug}/like")
    public ResponseEntity<?> like(@PathVariable String slug) {
        postService.like(slug);
        return ResponseEntity.ok().build();
    }
}
