import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface CalendarEvent {
  title: string;
  accent: 'orange' | 'red' | 'green';
}

interface CalendarDay {
  date: number | null;
  isCurrentMonth: boolean;
  events?: CalendarEvent[];
}

interface Notification {
  user: string;
  avatar: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-work-logs',
  standalone: true,
  templateUrl: './work-logs.html',
  styleUrls: ['./work-logs.css'],
  imports: [CommonModule, RouterModule],
})
export class WorkLogsComponent {
  calendarWeeks: CalendarDay[][] = [
    [
      { date: null, isCurrentMonth: false },
      { date: 1, isCurrentMonth: true },
      { date: 2, isCurrentMonth: true },
      { date: 3, isCurrentMonth: true },
      { date: 4, isCurrentMonth: true },
      { date: 5, isCurrentMonth: true },
      { date: 6, isCurrentMonth: true, events: [{ title: 'Dataset Cleanup', accent: 'red' }] },
    ],
    [
      { date: 7, isCurrentMonth: true },
      { date: 8, isCurrentMonth: true },
      { date: 9, isCurrentMonth: true },
      { date: 10, isCurrentMonth: true },
      { date: 11, isCurrentMonth: true },
      { date: 12, isCurrentMonth: true },
      { date: 13, isCurrentMonth: true, events: [{ title: 'Model Evaluation', accent: 'red' }] },
    ],
    [
      { date: 14, isCurrentMonth: true },
      { date: 15, isCurrentMonth: true },
      { date: 16, isCurrentMonth: true },
      { date: 17, isCurrentMonth: true },
      { date: 18, isCurrentMonth: true, events: [{ title: 'Prototype Integration Test', accent: 'orange' }] },
      { date: 19, isCurrentMonth: true },
      { date: 20, isCurrentMonth: true },
    ],
    [
      { date: 21, isCurrentMonth: true },
      { date: 22, isCurrentMonth: true },
      { date: 23, isCurrentMonth: true },
      { date: 24, isCurrentMonth: true },
      { date: 25, isCurrentMonth: true },
      { date: 26, isCurrentMonth: true },
      { date: 27, isCurrentMonth: true, events: [{ title: 'Augmentation Pipeline', accent: 'orange' }] },
    ],
    [
      { date: 28, isCurrentMonth: true },
      {
        date: 29,
        isCurrentMonth: true,
        events: [
          { title: 'COMP-HJ245', accent: 'green' },
          { title: 'COMP-JT1254', accent: 'green' },
        ],
      },
      { date: 30, isCurrentMonth: true },
      { date: null, isCurrentMonth: false },
      { date: null, isCurrentMonth: false },
      { date: null, isCurrentMonth: false },
      { date: null, isCurrentMonth: false },
    ],
  ];

  notifications: Notification[] = [
    {
      user: 'Supervisor feedback posted',
      avatar: 'S',
      message: '“Update sprint note for dataset cleanup.”',
      time: '2h ago',
    },
    {
      user: 'Deliverable approved',
      avatar: 'D',
      message: 'Dataset Cleanup report approved by Dr. Sahar.',
      time: '12h ago',
    },
    {
      user: 'Meeting schedule',
      avatar: 'M',
      message: 'Weekly sync moved to Thursday 11 AM.',
      time: 'Yesterday',
    },
    {
      user: 'Team comment',
      avatar: 'T',
      message: 'Omar mentioned you in “Model Evaluation Pipeline”.',
      time: 'Yesterday',
    },
    {
      user: 'Deadline approaching',
      avatar: 'C',
      message: 'Prototype Integration Test due Apr 18th.',
      time: '2 days ago',
    },
  ];

  getEventClass(event: CalendarEvent): string {
    return `calendar-event calendar-event--${event.accent}`;
  }
}
