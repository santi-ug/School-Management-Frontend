import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { Router } from "@angular/router"
import type { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Gestor Académico</h1>
        <h2 class="login-subtitle">Iniciar Sesión</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username"
              class="form-control"
              placeholder="Ingrese su usuario"
            >
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <div class="error-message">El usuario es requerido</div>
            }
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              class="form-control"
              placeholder="Ingrese su contraseña"
            >
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="error-message">La contraseña es requerida</div>
            }
          </div>
          
          @if (errorMessage) {
            <div class="alert-error">
              {{ errorMessage }}
            </div>
          }
          
          <button 
            type="submit" 
            class="login-button" 
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 30px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .login-title {
      text-align: center;
      margin-bottom: 10px;
      color: #3f51b5;
    }
    .login-subtitle {
      text-align: center;
      margin-bottom: 20px;
      font-weight: normal;
      color: #666;
    }
    .login-form {
      display: flex;
      flex-direction: column;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
    .alert-error {
      background-color: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
    .login-button {
      padding: 12px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .login-button:hover {
      background-color: #303f9f;
    }
    .login-button:disabled {
      background-color: #9fa8da;
      cursor: not-allowed;
    }
  `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  isLoading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"])
      },
      error: (error) => {
        this.isLoading = false
        this.errorMessage = "Usuario o contraseña incorrectos"
        console.error("Error de inicio de sesión", error)
      },
    })
  }
}

