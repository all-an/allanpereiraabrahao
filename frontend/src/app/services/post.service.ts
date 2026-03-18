import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  author: { username: string };
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  likeCount: number;
  createdAt: string;
  comments: Comment[];
}

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Post[]>('/api/posts');
  }

  getBySlug(slug: string) {
    return this.http.get<Post>(`/api/posts/${slug}`);
  }

  like(slug: string) {
    return this.http.post(`/api/posts/${slug}/like`, {});
  }

  addComment(slug: string, body: string) {
    return this.http.post<Comment>(`/api/posts/${slug}/comments`, { body });
  }

  // Admin
  create(post: Partial<Post>) {
    return this.http.post<Post>('/api/admin/posts', post);
  }

  update(id: number, post: Partial<Post>) {
    return this.http.put<Post>(`/api/admin/posts/${id}`, post);
  }

  delete(id: number) {
    return this.http.delete(`/api/admin/posts/${id}`);
  }
}
