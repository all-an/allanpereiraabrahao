package com.allanpereiraabrahao.blog.repository;

import com.allanpereiraabrahao.blog.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
