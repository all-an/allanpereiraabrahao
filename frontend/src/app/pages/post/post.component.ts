import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="post">
      <h1>{{ post.title }}</h1>
      <p class="meta">{{ post.createdAt | date:'MMM d, y' }}</p>
      <pre class="post-content">{{ post.content }}</pre>

      <div class="like-section">
        <button class="btn" (click)="like()">❤ Like ({{ post.likeCount }})</button>
      </div>

      <div class="comments">
        <h3>Comments ({{ post.comments.length }})</h3>

        <div class="comment" *ngFor="let c of post.comments">
          <span class="author">{{ c.author.username }}</span>
          <span class="date">{{ c.createdAt | date:'MMM d, y' }}</span>
          <p>{{ c.body }}</p>
        </div>

        <div style="margin-top:1.5rem">
          <ng-container *ngIf="auth.user$ | async; else needLogin">
            <h4>Add a comment</h4>
            <div class="form-group" style="margin-top:0.5rem">
              <textarea [(ngModel)]="commentBody" placeholder="Write your comment..."></textarea>
            </div>
            <button class="btn btn-primary" (click)="submitComment()">Post Comment</button>
          </ng-container>
          <ng-template #needLogin>
            <p style="color:#888">You must be logged in to comment.</p>
          </ng-template>
        </div>
      </div>
    </ng-container>
  `
})
export class PostComponent implements OnInit {
  post: Post | null = null;
  commentBody = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.postService.getBySlug(slug).subscribe(post => this.post = post);
  }

  like() {
    if (!this.post) return;
    this.postService.like(this.post.slug).subscribe(() => {
      this.post!.likeCount++;
    });
  }

  submitComment() {
    if (!this.post || !this.commentBody.trim()) return;
    this.postService.addComment(this.post.slug, this.commentBody).subscribe(comment => {
      this.post!.comments.push(comment);
      this.commentBody = '';
    });
  }
}
