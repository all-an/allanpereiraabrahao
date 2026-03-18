import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Posts</h1>
    <p *ngIf="posts.length === 0" style="margin-top:1rem;color:#888">No posts yet.</p>
    <div class="post-list" style="margin-top:1rem">
      <article class="post-card" *ngFor="let post of posts">
        <h2><a [routerLink]="['/posts', post.slug]">{{ post.title }}</a></h2>
        <p class="meta">
          {{ post.createdAt | date:'MMM d, y' }}
          &bull; {{ post.likeCount }} likes
          &bull; {{ post.comments.length }} comments
        </p>
        <p class="excerpt">{{ post.content | slice:0:200 }}{{ post.content.length > 200 ? '...' : '' }}</p>
        <a class="read-more" [routerLink]="['/posts', post.slug]">Read more</a>
      </article>
    </div>
  `
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getAll().subscribe(posts => this.posts = posts);
  }
}
