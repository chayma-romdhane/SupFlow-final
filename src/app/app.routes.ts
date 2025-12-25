import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { SignupComponent } from './pages/signup/signup';
import { ProjectsComponent } from './pages/projects/projects';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: ProjectsComponent },
  { path: '**', redirectTo: 'login' },
];


