package com.allanpereiraabrahao.blog.service;

import com.allanpereiraabrahao.blog.model.Post;
import com.allanpereiraabrahao.blog.repository.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> findAll() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post findBySlug(String slug) {
        return postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found: " + slug));
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    @Transactional
    public void like(String slug) {
        postRepository.incrementLike(slug);
    }
}
