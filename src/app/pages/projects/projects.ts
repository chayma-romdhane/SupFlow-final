import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  stats: {
    comments: number;
    files: number;
    updates?: number;
  };
  avatars: string[];
  statusLabel?: string;
  label?: string;
  priority?: string;
  owner?: string;
  dueDate?: string;
  attachments?: { name: string; url?: string }[];
}

interface WorkspaceColumn {
  id: string;
  title: string;
  helper: string;
  tasks: WorkspaceTask[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './projects.html',
  styleUrls: ['projects.css'],
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  isLoading = false;
  errorMessage = '';

  projectForm!: FormGroup;
  isFormOpen = false;
  isSubmitting = false;
  formError = '';

  availableStudents: any[] = [];
  isLoadingStudents = false;
  studentsError = '';
  memberSearchTerm = '';

  editingProject: any | null = null;
  deleteTarget: any | null = null;
  deleteError = '';
  isDeleting = false;

  statusOptions = ['In progress', 'Completed', 'On hold'];
  priorityOptions = ['Low', 'Medium', 'High'];
  isWorkspaceOpen = false;
  workspaceProject: any | null = null;
  activeWorkspaceColumns: WorkspaceColumn[] = [];
  dragContext: { columnId: string; task: WorkspaceTask } | null = null;
  dragHoverColumnId: string | null = null;
  isTaskModalOpen = false;
  isCreatingTask = false;
  taskForm!: FormGroup;
  selectedTask: WorkspaceTask | null = null;
  selectedTaskColumnId: string | null = null;

  private readonly workspaceColumnsTemplate: WorkspaceColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      helper: 'Plan tasks before they enter execution',
      tasks: [
        {
          id: 'task-backlog-1',
          title: 'Literature Review & State of the Art',
          description: 'Explore recent research on AI-based waste classification and smart recycling.',
          duration: '10 Days',
          priority: 'Low',
          owner: 'Chayma',
          dueDate: '2025-04-12',
          label: 'Research',
          stats: { comments: 2, files: 8, updates: 4 },
          avatars: ['Ch', 'Om', 'Li', 'Sa'],
          attachments: [
            { name: 'resources-1.pdf', url: '#' },
            { name: 'resources-2.pdf', url: '#' },
          ],
        },
        {
          id: 'task-backlog-2',
          title: 'Dataset Collection & Annotation',
          description: 'Gather waste imagery (plastic, metal, paper) and annotate samples in CVAT.',
          duration: '14 Days',
          priority: 'Medium',
          owner: 'Omar',
          dueDate: '2025-05-02',
          label: 'Dataset',
          stats: { comments: 3, files: 6, updates: 5 },
          avatars: ['Ch', 'Az', 'Ka', 'Ri'],
          attachments: [
            { name: 'dataset-guide.pdf', url: '#' },
            { name: 'collection-plan.docx', url: '#' },
          ],
        },
        {
          id: 'task-backlog-3',
          title: 'System Architecture Design',
          description: 'Define camera module, microcontroller / Raspberry Pi pipeline, plus dashboards.',
          duration: '8 Days',
          priority: 'High',
          owner: 'Sahar',
          dueDate: '2025-04-28',
          label: 'Architecture',
          stats: { comments: 4, files: 4, updates: 3 },
          avatars: ['Sa', 'Em', 'Ot', 'Fa'],
          attachments: [
            { name: 'architecture-draft.fig', url: '#' },
            { name: 'raspberry-pi-flow.png', url: '#' },
          ],
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In progress',
      helper: 'Track execution across the team',
      tasks: [
        {
          id: 'task-progress-1',
          title: 'Data Pre-Processing & Augmentation',
          description: 'Resize, normalize, flip and rotate samples. Balance classes for training.',
          duration: '7 Days',
          priority: 'Medium',
          owner: 'Mohamed',
          dueDate: '2025-04-19',
          label: 'Pipeline',
          stats: { comments: 2, files: 2, updates: 4 },
          avatars: ['Ch', 'Mo', 'Sa', 'Li'],
          attachments: [{ name: 'augmentation-notes.pdf', url: '#' }],
        },
        {
          id: 'task-progress-2',
          title: 'Model Training & Evaluation',
          description: 'Train YOLOv8 + MobileNet, evaluate recall, F1-score and learning curves.',
          duration: '12 Days',
          priority: 'High',
          owner: 'Anis',
          dueDate: '2025-05-10',
          label: 'AI',
          stats: { comments: 3, files: 5, updates: 6 },
          avatars: ['Mo', 'An', 'Sa', 'Is'],
          attachments: [
            { name: 'training-log.xlsx', url: '#' },
            { name: 'evaluation-report.pdf', url: '#' },
          ],
        },
        {
          id: 'task-progress-3',
          title: 'Hardware Integration',
          description: 'Connect the camera module to Raspberry Pi, add motor control for sorting.',
          duration: '10 Days',
          priority: 'Low',
          owner: 'Hedia',
          dueDate: '2025-05-01',
          label: 'Hardware',
          stats: { comments: 2, files: 4, updates: 2 },
          avatars: ['He', 'Ra', 'Mo', 'Sa'],
          attachments: [{ name: 'wiring-diagram.png', url: '#' }],
        },
      ],
    },
    {
      id: 'completed',
      title: 'Completed',
      helper: 'Validated milestones',
      tasks: [
        {
          id: 'task-complete-1',
          title: 'Problem Definition & Requirements',
          description: 'Define objectives, functional & non-functional requirements plus success metrics.',
          duration: 'Completed',
          priority: 'Low',
          owner: 'Chayma',
          dueDate: '2025-03-01',
          label: 'Milestone',
          stats: { comments: 7, files: 2, updates: 1 },
          avatars: ['Ch', 'Sa', 'He', 'Mo'],
          statusLabel: 'Completed',
          attachments: [{ name: 'requirements.docx', url: '#' }],
        },
        {
          id: 'task-complete-2',
          title: 'Project Topic Validation',
          description: 'Present project scope to supervisors, validate feasibility and available resources.',
          duration: 'Completed',
          priority: 'Medium',
          owner: 'Sahar',
          dueDate: '2025-03-18',
          label: 'Approval',
          stats: { comments: 5, files: 0, updates: 2 },
          avatars: ['Sa', 'Em', 'Mo', 'Az'],
          statusLabel: 'Completed',
          attachments: [{ name: 'validation-slides.pdf', url: '#' }],
        },
        {
          id: 'task-complete-3',
          title: 'Project Timeline & Sprint Planning',
          description: 'Define milestones, sprint cadence, assign roles, and identify deliverables.',
          duration: 'Completed',
          priority: 'Low',
          owner: 'Chayma',
          dueDate: '2025-03-25',
          label: 'Planning',
          stats: { comments: 6, files: 8, updates: 3 },
          avatars: ['Ch', 'Sa', 'Mo', 'He'],
          statusLabel: 'Completed',
          attachments: [
            { name: 'timeline.xlsx', url: '#' },
            { name: 'roles-overview.pdf', url: '#' },
          ],
        },
      ],
    },
  ];

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.buildTaskForm();
    this.fetchProjects();
    this.fetchStudents();
  }

  openProjectForm(project?: any): void {
    this.editingProject = project ?? null;
    this.isFormOpen = true;
    this.formError = '';
    this.isSubmitting = false;
    this.memberSearchTerm = '';
    this.setFormValues(project);
  }

  closeProjectForm(): void {
    this.isFormOpen = false;
    this.formError = '';
    this.isSubmitting = false;
    this.memberSearchTerm = '';
    this.editingProject = null;
    this.setFormValues();
  }

  submitProjectForm(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const formValue = this.projectForm.value;
    const selectedStudentIds: number[] = (formValue.studentIds ?? [])
      .map((id: string | number) => Number(id))
      .filter((id: number) => !Number.isNaN(id));
    const payload = {
      title: formValue.title,
      type: formValue.type || 'General',
      classe: formValue.classe,
      superviseur: formValue.superviseur,
      description: formValue.description,
      status: formValue.status || 'In progress',
      students: selectedStudentIds.length ? selectedStudentIds.map((id: number) => ({ id })) : undefined,
    };

    this.isSubmitting = true;
    this.formError = '';
    const editingId = this.editingProject?.id;
    const request$ = editingId ? this.api.updateProject(editingId, payload) : this.api.createProject(payload);

    request$.subscribe({
      next: (project) => {
        if (editingId) {
          this.projects = this.projects.map((item) => (item.id === project.id ? project : item));
        } else {
          this.projects = [project, ...this.projects];
        }
        this.isSubmitting = false;
        this.closeProjectForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.formError = err?.error ?? 'Failed to save project';
      },
    });
  }

  get selectedStudentIds(): number[] {
    const control = this.projectForm?.get('studentIds');
    return (control?.value as number[]) ?? [];
  }

  get selectedStudents(): any[] {
    const ids = this.selectedStudentIds;
    if (!ids.length) {
      return [];
    }
    const lookup = new Map<number, any>();
    [...this.availableStudents, ...(this.editingProject?.students ?? [])].forEach((student) => {
      const id = Number(student?.id);
      if (id && !lookup.has(id)) {
        lookup.set(id, student);
      }
    });
    return ids.map((id) => lookup.get(id) ?? { id, name: 'Member' });
  }

  get filteredStudents(): any[] {
    const term = this.memberSearchTerm.trim().toLowerCase();
    const selected = new Set(this.selectedStudentIds);
    const filtered = this.availableStudents.filter((student) => {
      const id = Number(student?.id);
      if (!id || selected.has(id)) {
        return false;
      }
      if (!term) {
        return true;
      }
      const searchable = `${student?.name ?? ''} ${student?.email ?? ''} ${student?.role ?? ''} ${student?.program ?? ''}`.toLowerCase();
      return searchable.includes(term);
    });
    return filtered.slice(0, 8);
  }

  isStudentSelected(studentId?: number): boolean {
    if (studentId == null) {
      return false;
    }
    return this.selectedStudentIds.includes(studentId);
  }

  selectStudent(student: any): void {
    const studentId = Number(student?.id);
    if (!studentId || this.isStudentSelected(studentId)) {
      return;
    }
    const control = this.projectForm.get('studentIds');
    control?.setValue([...this.selectedStudentIds, studentId]);
    control?.markAsDirty();
    this.memberSearchTerm = '';
  }

  removeStudent(studentId?: number): void {
    if (studentId == null) {
      return;
    }
    const control = this.projectForm.get('studentIds');
    const updated = this.selectedStudentIds.filter((id) => id !== studentId);
    control?.setValue(updated);
    control?.markAsDirty();
  }

  onMemberSearch(term: string): void {
    this.memberSearchTerm = term ?? '';
  }

  clearMemberSearch(): void {
    this.memberSearchTerm = '';
  }

  getMemberInitial(member: any): string {
    const source = (member?.name ?? member?.email ?? 'M').toString().trim();
    return source.charAt(0).toUpperCase() || 'M';
  }

  getMemberDisplay(member: any): string {
    return member?.name || member?.email || 'Member';
  }

  getOwnerInitials(owner?: string): string {
    if (!owner) {
      return 'U';
    }
    return owner
      .toString()
      .split(/\s+/)
      .map((part) => part.charAt(0).toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join('') || 'U';
  }

  formatDueDate(date?: string | null): string {
    if (!date) {
      return 'No due date';
    }
    try {
      const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return formatter.format(new Date(date));
    } catch {
      return date;
    }
  }

  getPriorityPillClass(priority?: string): string {
    const value = (priority ?? 'low').toLowerCase();
    return `priority-pill priority-pill--${value}`;
  }

  get taskModalAvatars(): string[] {
    if (this.selectedTask?.avatars?.length) {
      return this.selectedTask.avatars.slice(0, 4);
    }
    return ['AB'];
  }

  getAttachmentExt(name?: string): string {
    if (!name) {
      return 'FILE';
    }
    const trimmed = name.toString().trim();
    const parts = trimmed.split('.');
    if (parts.length > 1) {
      return (parts.pop() || '').toUpperCase();
    }
    return 'FILE';
  }

  getStatusClass(project: any): string {
    const status = (project?.status || '').toString().toLowerCase().replace(/\s+/g, '-');
    return status ? `status-${status}` : 'status-default';
  }

  requestDelete(project: any): void {
    this.deleteTarget = project;
    this.deleteError = '';
    this.isDeleting = false;
  }

  cancelDelete(): void {
    this.deleteTarget = null;
    this.deleteError = '';
    this.isDeleting = false;
  }

  deleteProject(): void {
    if (!this.deleteTarget?.id) {
      return;
    }
    this.isDeleting = true;
    this.deleteError = '';
    this.api.deleteProject(this.deleteTarget.id).subscribe({
      next: () => {
        this.projects = this.projects.filter((project) => project.id !== this.deleteTarget?.id);
        this.isDeleting = false;
        this.cancelDelete();
      },
      error: (err) => {
        this.isDeleting = false;
        this.deleteError = err?.error ?? 'Failed to delete project';
      },
    });
  }

  private buildForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      type: [''],
      classe: ['', Validators.required],
      superviseur: ['', Validators.required],
      description: [''],
      status: ['In progress', Validators.required],
      studentIds: this.fb.control<string[] | number[]>([]),
    });
    this.setFormValues();
  }

  private setFormValues(project?: any): void {
    if (!this.projectForm) {
      return;
    }
    const studentIds =
      project?.students
        ?.map((student: any) => Number(student?.id))
        .filter((id: number) => !Number.isNaN(id)) ?? [];
    this.projectForm.reset({
      title: project?.title ?? '',
      type: project?.type ?? '',
      classe: project?.classe ?? '',
      superviseur: project?.superviseur ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'In progress',
      studentIds,
    });
  }

  private fetchProjects(): void {
    this.isLoading = true;
    this.api.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error ?? 'Failed to load projects';
      },
    });
  }

  private fetchStudents(): void {
    this.isLoadingStudents = true;
    this.api.getUsers().subscribe({
      next: (students) => {
        this.availableStudents = students ?? [];
        this.isLoadingStudents = false;
      },
      error: (err) => {
        this.isLoadingStudents = false;
        this.studentsError = err?.error ?? 'Failed to load students';
      },
    });
  }

  private buildTaskForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      label: [''],
      description: [''],
      duration: [''],
      priority: ['Medium'],
      owner: [''],
      dueDate: [''],
    });
  }

  openWorkspace(project?: any): void {
    this.workspaceProject = project ?? null;
    this.activeWorkspaceColumns = this.workspaceColumnsTemplate.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({
        ...task,
        stats: { ...task.stats },
        avatars: [...task.avatars],
        attachments: task.attachments ? task.attachments.map((attachment) => ({ ...attachment })) : [],
      })),
    }));
    this.dragContext = null;
    this.dragHoverColumnId = null;
    this.isWorkspaceOpen = true;
    this.closeTaskModal();
  }

  closeWorkspace(): void {
    this.isWorkspaceOpen = false;
    this.workspaceProject = null;
    this.activeWorkspaceColumns = [];
    this.dragContext = null;
    this.dragHoverColumnId = null;
    this.closeTaskModal();
  }

  openTaskModal(columnId: string, task?: WorkspaceTask): void {
    this.selectedTaskColumnId = columnId;
    this.selectedTask = task ?? null;
    this.isCreatingTask = !task;
    this.isTaskModalOpen = true;
    this.taskForm?.reset({
      title: task?.title ?? '',
      label: task?.label ?? '',
      description: task?.description ?? '',
      duration: task?.duration ?? '',
      priority: task?.priority ?? 'Medium',
      owner: task?.owner ?? '',
      dueDate: task?.dueDate ?? '',
    });
  }

  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.isCreatingTask = false;
    this.selectedTask = null;
    this.selectedTaskColumnId = null;
    this.taskForm?.reset();
  }

  submitTaskForm(): void {
    if (!this.taskForm || this.taskForm.invalid || !this.selectedTaskColumnId) {
      this.taskForm?.markAllAsTouched();
      return;
    }
    const formValue = this.taskForm.value;
    const updatedTask: WorkspaceTask = {
      id: this.selectedTask?.id ?? this.generateTaskId(),
      title: formValue.title,
      label: formValue.label,
      description: formValue.description ?? '',
      duration: formValue.duration ?? '',
      priority: formValue.priority ?? 'Medium',
      owner: formValue.owner ?? '',
      dueDate: formValue.dueDate ?? '',
      stats: this.selectedTask?.stats
        ? { ...this.selectedTask.stats }
        : {
            comments: 0,
            files: 0,
          },
      avatars: this.selectedTask?.avatars?.length ? [...this.selectedTask.avatars] : ['AB'],
      statusLabel: this.selectedTask?.statusLabel,
      attachments: this.selectedTask?.attachments?.length
        ? this.selectedTask.attachments.map((attachment) => ({ ...attachment }))
        : [],
    };

    this.activeWorkspaceColumns = this.activeWorkspaceColumns.map((column) => {
      if (column.id !== this.selectedTaskColumnId) {
        return column;
      }
      const tasks = [...column.tasks];
      if (this.selectedTask) {
        const index = tasks.findIndex((task) => task.id === this.selectedTask?.id);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...updatedTask };
        }
      } else {
        tasks.unshift(updatedTask);
      }
      return { ...column, tasks };
    });

    this.closeTaskModal();
  }

  onTaskDragStart(event: DragEvent, columnId: string, task: WorkspaceTask): void {
    this.dragContext = { columnId, task };
    if (event?.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.title);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onTaskDragEnd(): void {
    this.dragContext = null;
    this.dragHoverColumnId = null;
  }

  allowTaskDrop(event: DragEvent): void {
    event?.preventDefault();
  }

  onColumnDragEnter(columnId: string, event: DragEvent): void {
    if (!this.dragContext) {
      return;
    }
    event?.preventDefault();
    this.dragHoverColumnId = columnId;
  }

  onColumnDragLeave(columnId: string, event: DragEvent): void {
    if (!this.dragContext) {
      return;
    }
    const related = event?.relatedTarget as HTMLElement | null;
    if (event.currentTarget instanceof HTMLElement && related && event.currentTarget.contains(related)) {
      return;
    }
    if (this.dragHoverColumnId === columnId) {
      this.dragHoverColumnId = null;
    }
  }

  onTaskDrop(columnId: string, event: DragEvent): void {
    if (!this.dragContext) {
      return;
    }
    event?.preventDefault();
    const { columnId: sourceId, task } = this.dragContext;
    if (sourceId === columnId) {
      this.onTaskDragEnd();
      return;
    }
    this.activeWorkspaceColumns = this.activeWorkspaceColumns.map((column) => {
      if (column.id === sourceId) {
        return { ...column, tasks: column.tasks.filter((item) => item !== task) };
      }
      if (column.id === columnId) {
        return { ...column, tasks: [...column.tasks, task] };
      }
      return column;
    });
    this.onTaskDragEnd();
  }

  private generateTaskId(): string {
    return `task-${Math.random().toString(36).slice(2, 9)}`;
  }

  get selectedTaskColumnTitle(): string {
    const column = this.activeWorkspaceColumns.find((item) => item.id === this.selectedTaskColumnId);
    return column?.title ?? '';
  }
}
