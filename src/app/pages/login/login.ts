import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router} from '@angular/router';
import { ApiService } from '../../services/api.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  showPwd = false;
  isSubmitting = false;
  errorMessage = '';
  form = {
    email: '',
    password: '',
    remember: false,
  };

  togglePwd(): void {
    this.showPwd = !this.showPwd;
  }
  constructor(private router: Router, private api: ApiService) {}

  onSubmit(): void {
    if (!this.form.email || !this.form.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    this.api.login({ email: this.form.email, password: this.form.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (err.status === 0) {
          this.errorMessage = 'Impossible de joindre le serveur backend. Vérifie qu’il est lancé sur :8080.';
          return;
        }
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
          return;
        }
        this.errorMessage = err.message || 'Login failed';
      },
    });
  }
}
