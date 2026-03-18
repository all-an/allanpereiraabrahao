import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Admin</h1>

    <!-- Post form -->
    <div style="margin:1.5rem 0">
      <h3>{{ editing ? 'Edit Post' : 'New Post' }}</h3>
      <form (ngSubmit)="save()" style="max-width:560px;margin-top:0.75rem">
        <div class="form-group">
          <label>Title</label>
          <input type="text" [(ngModel)]="form.title" name="title" required />
        </div>
        <div class="form-group">
          <label>Slug (auto-generated if blank)</label>
          <input type="text" [(ngModel)]="form.slug" name="slug" />
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea [(ngModel)]="form.content" name="content" required style="min-height:160px"></textarea>
        </div>
        <button class="btn btn-primary" type="submit">{{ editing ? 'Update' : 'Create' }}</button>
        <button class="btn" type="button" *ngIf="editing" (click)="cancelEdit()" style="margin-left:0.5rem">Cancel</button>
      </form>
    </div>

    <!-- Post list -->
    <h3>All Posts</h3>
    <table style="margin-top:0.75rem">
      <thead>
        <tr><th>Title</th><th>Likes</th><th>Comments</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let post of posts">
          <td>{{ post.title }}</td>
          <td>{{ post.likeCount }}</td>
          <td>{{ post.comments.length }}</td>
          <td>
            <button class="btn" (click)="edit(post)">Edit</button>
            <button class="btn btn-danger" (click)="delete(post.id)" style="margin-left:0.5rem">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Change password -->
    <div style="margin-top:3rem;max-width:360px">
      <h3>Change Password</h3>
      <form (ngSubmit)="changePassword()" style="margin-top:0.75rem">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" [(ngModel)]="pwForm.currentPassword" name="currentPassword" required />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" [(ngModel)]="pwForm.newPassword" name="newPassword" required />
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" [(ngModel)]="pwForm.confirmPassword" name="confirmPassword" required />
        </div>
        <p class="error" *ngIf="pwError">{{ pwError }}</p>
        <p style="color:green;font-size:0.9rem" *ngIf="pwSuccess">{{ pwSuccess }}</p>
        <button class="btn btn-primary" type="submit">Update Password</button>
      </form>
    </div>
  `
})
export class AdminComponent implements OnInit {
  posts: Post[] = [];
  editing: Post | null = null;
  form: Partial<Post> = { title: '', slug: '', content: '' };

  pwForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  pwError = '';
  pwSuccess = '';

  constructor(private postService: PostService, private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.postService.getAll().subscribe(posts => this.posts = posts);
  }

  save() {
    const action = this.editing
      ? this.postService.update(this.editing.id, this.form)
      : this.postService.create(this.form);

    action.subscribe(() => {
      this.form = { title: '', slug: '', content: '' };
      this.editing = null;
      this.load();
    });
  }

  edit(post: Post) {
    this.editing = post;
    this.form = { title: post.title, slug: post.slug, content: post.content };
  }

  cancelEdit() {
    this.editing = null;
    this.form = { title: '', slug: '', content: '' };
  }

  delete(id: number) {
    if (!confirm('Delete this post?')) return;
    this.postService.delete(id).subscribe(() => this.load());
  }

  changePassword() {
    this.pwError = '';
    this.pwSuccess = '';

    if (this.pwForm.newPassword !== this.pwForm.confirmPassword) {
      this.pwError = 'New passwords do not match';
      return;
    }

    this.http.put<{ message?: string; error?: string }>('/api/admin/password', {
      currentPassword: this.pwForm.currentPassword,
      newPassword: this.pwForm.newPassword
    }).subscribe({
      next: res => {
        this.pwSuccess = res.message ?? 'Password updated';
        this.pwForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: err => {
        this.pwError = err.error?.error ?? 'Failed to update password';
      }
    });
  }
}
