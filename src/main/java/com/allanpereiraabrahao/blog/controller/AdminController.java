package com.allanpereiraabrahao.blog.controller;

import com.allanpereiraabrahao.blog.model.Post;
import com.allanpereiraabrahao.blog.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminController {

    private final PostService postService;

    public AdminController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> list() {
        return postService.findAll();
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        if (post.getSlug() == null || post.getSlug().isBlank()) {
            post.setSlug(post.getTitle().toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-|-$", ""));
        }
        return postService.save(post);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post post) {
        post.setId(id);
        return postService.save(post);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.ok(Map.of("deleted", id));
    }
}
