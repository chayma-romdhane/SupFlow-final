import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
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
}
