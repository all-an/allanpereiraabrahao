package com.allanpereiraabrahao.blog.repository;

import com.allanpereiraabrahao.blog.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);
    List<Post> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + 1 WHERE p.slug = :slug")
    void incrementLike(String slug);
}
