import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface TaskCard {
  id: string;
  title: string;
  description: string;
  stage: 'Completed' | 'In progress' | 'Backlog';
  priority: 'low' | 'medium' | 'high';
  duration: string;
  durationType: 'timer' | 'days';
  updates: number;
  comments: number;
  assignee: string;
  assigneeInitials: string;
  reviewer: string;
  dueDate: string;
  attachments: string[];
  notes: string;
  details: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
  imports: [CommonModule, RouterModule],
})
export class TasksComponent {
  searchTerm = '';
  isDetailOpen = false;
  selectedTask: TaskCard | null = null;
  tasks: TaskCard[] = [
    {
      id: 'task-1',
      title: 'Prepare Mid-Sprint Progress Report',
      description: 'Sprint 2 — Submitted to Supervisor · Group P2M-06',
      stage: 'Completed',
      priority: 'low',
      duration: '00:30:00',
      durationType: 'timer',
      updates: 2,
      comments: 2,
      assignee: 'Chayma',
      assigneeInitials: 'Ch',
      reviewer: 'Dr. Sahar Ben Said',
      dueDate: 'April 12th, 2025',
      attachments: ['model_v1.pt', 'evaluation_report.pdf', 'confusion_matrix.png'],
      notes:
        'Model achieved 91.3% accuracy, 89.7% recall and 90.2% F1-score. Further improvement planned via hyper-parameter tuning and dataset expansion.',
      details:
        'Train the YOLOv8 model on the annotated waste-image dataset. Goals: Build training pipeline, monitor accuracy, recall & F1-score. Log performance & confusion matrix.',
    },
    {
      id: 'task-2',
      title: 'Literature Review Summary Report',
      description: 'Summarize key journal papers on smart waste classification.',
      stage: 'Backlog',
      priority: 'low',
      duration: '10 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Omar',
      assigneeInitials: 'Om',
      reviewer: 'Chayma Romdhane',
      dueDate: 'April 10th, 2025',
      attachments: ['literature_grid.docx'],
      notes: 'Pending summary for sections 4 & 5.',
      details: 'Summaries must highlight AI classification techniques, metrics, and dataset comparisons.',
    },
    {
      id: 'task-3',
      title: 'Dataset Collection & Annotation',
      description: 'Upload labeled waste dataset (plastic, paper, glass, metal categories).',
      stage: 'In progress',
      priority: 'low',
      duration: '14 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Sahar',
      assigneeInitials: 'Sa',
      reviewer: 'Dr. Sahar Ben Said',
      dueDate: 'April 18th, 2025',
      attachments: ['dataset_plan.pdf'],
      notes: 'Need extra volunteers for annotation shift.',
      details: 'Coordinate dataset pipeline, ensure quality control for annotations and metadata tagging.',
    },
    {
      id: 'task-4',
      title: 'Pre-Processing Pipeline Setup',
      description: 'Build scripts to image resizing, normalization, and augmentation.',
      stage: 'In progress',
      priority: 'low',
      duration: '7 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Chayma',
      assigneeInitials: 'Ch',
      reviewer: 'Omar',
      dueDate: 'April 15th, 2025',
      attachments: ['pipeline-notes.md'],
      notes: 'Ensure augmentation coverage for minority classes.',
      details: 'Set up data preprocessing scripts and automation for training ingestion.',
    },
    {
      id: 'task-5',
      title: 'YOLO Model Training',
      description: 'Train classification models & report performance metrics.',
      stage: 'In progress',
      priority: 'high',
      duration: '12 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Mohamed',
      assigneeInitials: 'Mo',
      reviewer: 'Chayma Romdhane',
      dueDate: 'April 22nd, 2025',
      attachments: ['training-log.csv'],
      notes: 'GPU allocation pending for next run.',
      details: 'Run YOLO model training with evaluation metrics and log monitoring.',
    },
    {
      id: 'task-6',
      title: 'Hardware Integration Draft',
      description: 'Connect camera module to Raspberry Pi & test low latency prediction stream.',
      stage: 'In progress',
      priority: 'low',
      duration: '10 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Hedia',
      assigneeInitials: 'He',
      reviewer: 'Dr. Sahar Ben Said',
      dueDate: 'April 20th, 2025',
      attachments: ['hardware-draft.pdf'],
      notes: 'Awaiting components shipment.',
      details: 'Draft hardware integration notes and measurement for mechanical design.',
    },
    {
      id: 'task-7',
      title: 'System Architecture Diagram',
      description: 'Figure diagram submission: end-to-end pipeline + edge device flow.',
      stage: 'Backlog',
      priority: 'low',
      duration: '8 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Sahar',
      assigneeInitials: 'Sa',
      reviewer: 'Chayma',
      dueDate: 'April 24th, 2025',
      attachments: ['architecture.fig'],
      notes: 'Need final review for color coding.',
      details: 'Update architecture diagram to include dashboard data flow.',
    },
    {
      id: 'task-8',
      title: 'Ethics & Data Usage Compliance Form',
      description: 'Submit data privacy forms & ethical research declaration.',
      stage: 'Completed',
      priority: 'low',
      duration: '30 Days',
      durationType: 'days',
      updates: 2,
      comments: 2,
      assignee: 'Chayma',
      assigneeInitials: 'Ch',
      reviewer: 'Dr. Sahar Ben Said',
      dueDate: 'May 1st, 2025',
      attachments: ['ethics-form.pdf', 'data_compliance.docx'],
      notes: 'Awaiting signature from faculty.',
      details: 'Compile ethics data forms and compliance records for the sprint.',
    },
  ];

  getStageClass(stage: TaskCard['stage']): string {
    const normalized = stage.toLowerCase().replace(/\s+/g, '-');
    return `stage-chip stage-chip--${normalized}`;
  }

  getPriorityClass(priority: TaskCard['priority']): string {
    return `priority-chip priority-chip--${priority}`;
  }

  getDurationClass(task: TaskCard): string {
    return task.durationType === 'timer' ? 'duration-chip duration-chip--timer' : 'duration-chip duration-chip--days';
  }

  openTaskDetail(task: TaskCard): void {
    this.selectedTask = task;
    this.isDetailOpen = true;
  }

  closeTaskDetail(): void {
    this.isDetailOpen = false;
    this.selectedTask = null;
  }
}
