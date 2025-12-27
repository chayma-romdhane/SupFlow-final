import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { SignupComponent } from './pages/signup/signup';
import { ProjectsComponent } from './pages/projects/projects';
import { TasksComponent } from './pages/tasks/tasks';
import { WorkLogsComponent } from './pages/work-logs/work-logs';
import { ChatsComponent } from './pages/chats/chats';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: Dashboard },
  { path: 'projects', component: ProjectsComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'work-logs', component: WorkLogsComponent },
  { path: 'chats', component: ChatsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: 'login' },
];
