import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav>
      <a class="brand" routerLink="/">Blog</a>
      <div class="nav-links">
        <ng-container *ngIf="auth.user$ | async as user; else loggedOut">
          <span>{{ user.username }}</span>
          <button class="btn-link" (click)="logout()">Logout</button>
          <a *ngIf="user.role === 'ROLE_ADMIN'" routerLink="/admin">Admin</a>
        </ng-container>
        <ng-template #loggedOut>
          <a routerLink="/login">Login</a>
        </ng-template>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.fetchMe();
  }

  logout() {
    this.auth.logout();
  }
}
