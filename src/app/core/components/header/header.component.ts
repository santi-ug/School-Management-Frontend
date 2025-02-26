import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"
import type { AuthService } from "../../services/auth.service"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="header">
      <div class="logo">
        <h1>Gestor Académico</h1>
      </div>
      <nav class="nav">
        <ul class="nav-list">
          <li><a routerLink="/dashboard">Dashboard</a></li>
          @if (isLoggedIn) {
            <li><button (click)="logout()" class="logout-btn">Cerrar Sesión</button></li>
          }
        </ul>
      </nav>
    </header>
  `,
  styles: [
    `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 60px;
      background-color: #3f51b5;
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-list li {
      margin-left: 20px;
    }
    .nav-list a {
      color: white;
      text-decoration: none;
    }
    .logout-btn {
      background: none;
      border: 1px solid white;
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
  `,
  ],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout(): void {
    this.authService.logout()
  }
}

