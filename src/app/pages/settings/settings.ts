import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface ProjectRow {
  name: string;
  tasks: string;
  progress: number;
  hours: string;
}

interface NotificationItem {
  title: string;
  message: string;
  time: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
  attachment?: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  imports: [CommonModule, RouterModule],
})
export class SettingsComponent {
  stats = {
    tasks: 8,
    projects: 3,
  };

  projects: ProjectRow[] = [
    { name: 'Pacte', tasks: '25/25', progress: 100, hours: '50' },
    { name: 'P2M', tasks: '38/56', progress: 68, hours: '20:42' },
    
  ];

  notifications: NotificationItem[] = [
    {
      title: 'Supervisor feedback posted',
      message: 'Prototype demo: clarify lighting conditions',
      time: '12 min ago',
      color: 'blue',
      attachment: 'Feedback.pdf',
    },
    {
      title: 'Deadline approaching',
      message: 'Mid-sprint report due in 2 days.',
      time: '45 min ago',
      color: 'red',
    },
    {
      title: 'Dataset uploaded',
      message: '5 Updates',
      time: '2 day ago',
      color: 'yellow',
    },
    {
      title: 'Meeting scheduled',
      message: 'Sprint review with Dr. Sahar — Tue 10:00, Lab 302.',
      time: '5 day ago',
      color: 'green',
    },
  ];
}
