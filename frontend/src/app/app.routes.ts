import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts/:slug', component: PostComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
