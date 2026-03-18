package com.allanpereiraabrahao.blog.controller;

import com.allanpereiraabrahao.blog.model.Comment;
import com.allanpereiraabrahao.blog.model.Post;
import com.allanpereiraabrahao.blog.service.CommentService;
import com.allanpereiraabrahao.blog.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts/{slug}/comments")
public class CommentController {

    private final PostService postService;
    private final CommentService commentService;

    public CommentController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable String slug,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Post post = postService.findBySlug(slug);
        Comment comment = commentService.addComment(post, userDetails.getUsername(), body.get("body"));
        return ResponseEntity.ok(comment);
    }
}
