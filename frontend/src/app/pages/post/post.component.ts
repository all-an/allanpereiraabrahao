import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PostService, Post } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { marked } from 'marked';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();
renderer.code = (code: string, lang: string | undefined) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(code, { language }).value;
  return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
};
marked.use({ renderer });

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html'
})
export class PostComponent implements OnInit {
  post: Post | null = null;
  renderedContent: SafeHtml = '';
  commentBody = '';
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    public auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.postService.getBySlug(slug).subscribe({
      next: post => {
        this.post = post;
        this.renderedContent = this.sanitizer.bypassSecurityTrustHtml(marked.parse(post.content) as string);
      },
      error: () => this.notFound = true
    });
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
