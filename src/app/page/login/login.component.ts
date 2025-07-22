import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import  { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Si déjà connecté, redirige vers la home
    if (this.authService.currentUserValue) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          // Connexion réussie - redirection vers home
          alert("test")
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          // Message d'erreur spécifique pour mot de passe incorrect
          if (error.status === 401) {
            this.errorMessage = 'Email ou mot de passe incorrect';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}