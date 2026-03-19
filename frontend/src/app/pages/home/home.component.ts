import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  loading = true;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.loading = false;
    });
  }
}
