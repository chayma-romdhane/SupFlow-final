import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  submitting = false;
  statusMessage = '';
  statusType: 'error' | 'success' | '' = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: [
          '',
          [Validators.required, Validators.email, Validators.pattern(/^[A-Za-z0-9._%+-]+@supcom\.tn$/i)],
        ],
        role: ['', Validators.required],
        programYear: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        acceptTerms: [false, Validators.requiredTrue],
      },
      { validators: [SignupComponent.passwordsMatchValidator] }
    );
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.statusMessage = '';
    this.statusType = '';
    this.submitting = true;

    const formValue = this.signupForm.value;
    const payload = {
      name: formValue.fullName,
      role: formValue.role,
      program: formValue.programYear,
      email: formValue.email,
      password: formValue.password,
    };

    this.api.checkEmail(payload.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.submitting = false;
          this.statusMessage = 'An account with this email already exists.';
          this.statusType = 'error';
          return;
        }

        this.api.signup(payload).subscribe({
          next: () => {
            this.submitting = false;
            this.statusMessage = 'Account created successfully. You can log in now.';
            this.statusType = 'success';
          },
          error: (err) => {
            this.submitting = false;
            this.statusMessage = err?.error ?? 'Sign up failed';
            this.statusType = 'error';
          },
        });
      },
      error: (err) => {
        this.submitting = false;
        this.statusMessage = err?.error ?? 'Unable to verify email';
        this.statusType = 'error';
      },
    });
  }

  private static passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
  }
}
