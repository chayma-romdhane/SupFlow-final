import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  role: string;
  program: string;
  email: string;
  password: string;
}

interface CreateProjectRequest {
  title: string;
  type?: string;
  classe: string;
  superviseur: string;
  description?: string;
  status?: string;
  students?: Array<{ id: number }>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:9090';

  private http = inject(HttpClient);

  login(body: LoginRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/login`, body);
  }

  signup(body: SignupRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/create`, body);
  }

  checkEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/User/check-email`, {
      params: { email },
    });
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Project/get`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/User/get`);
  }

  createProject(body: CreateProjectRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/Project/create`, body);
  }

  updateProject(id: number, body: CreateProjectRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/Project/update/${id}`, body);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Project/delete/${id}`);
  }
}
