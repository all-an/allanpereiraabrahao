package com.allanpereiraabrahao.blog.service;

import com.allanpereiraabrahao.blog.model.Comment;
import com.allanpereiraabrahao.blog.model.Post;
import com.allanpereiraabrahao.blog.model.User;
import com.allanpereiraabrahao.blog.repository.CommentRepository;
import com.allanpereiraabrahao.blog.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public Comment addComment(Post post, String username, String body) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setBody(body);
        return commentRepository.save(comment);
    }

    public void delete(Long id) {
        commentRepository.deleteById(id);
    }
}
