import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Login</h1>
    <form (ngSubmit)="submit()" style="margin-top:1rem;max-width:360px">
      <div class="form-group">
        <label>Username</label>
        <input type="text" [(ngModel)]="username" name="username" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" [(ngModel)]="password" name="password" required />
      </div>
      <p class="error" *ngIf="error">{{ error }}</p>
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: user => {
        this.auth.user$.next(user);
        this.router.navigate(['/']);
      },
      error: () => this.error = 'Invalid username or password'
    });
  }
}
