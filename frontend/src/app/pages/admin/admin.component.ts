import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html'
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
