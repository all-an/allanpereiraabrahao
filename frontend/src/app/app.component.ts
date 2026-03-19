import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  dark = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.fetchMe();
    this.dark = localStorage.getItem('darkMode') === 'true';
    this.applyDark();
  }

  toggleDark() {
    this.dark = !this.dark;
    localStorage.setItem('darkMode', String(this.dark));
    this.applyDark();
  }

  private applyDark() {
    document.body.classList.toggle('dark', this.dark);
  }

  logout() {
    this.auth.logout();
  }
}
