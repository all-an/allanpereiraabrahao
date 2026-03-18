import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface UserInfo {
  authenticated: boolean;
  username?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<UserInfo | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  fetchMe() {
    this.http.get<UserInfo>('/api/auth/me').subscribe({
      next: user => this.user$.next(user.authenticated ? user : null),
      error: () => this.user$.next(null)
    });
  }

  login(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post<UserInfo>('/api/auth/login', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  logout() {
    this.http.post('/api/auth/logout', {}).subscribe(() => {
      this.user$.next(null);
      this.router.navigate(['/']);
    });
  }
}
