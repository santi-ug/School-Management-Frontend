import { Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "app-acceso-denegado",
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="acceso-denegado-container">
      <div class="acceso-denegado-content">
        <h1 class="acceso-denegado-title">403</h1>
        <h2 class="acceso-denegado-subtitle">Acceso Denegado</h2>
        <p class="acceso-denegado-message">
          Lo sentimos, no tienes permisos para acceder a esta página.
        </p>
        <a routerLink="/dashboard" class="acceso-denegado-button">Volver al Dashboard</a>
      </div>
    </div>
  `,
  styles: [
    `
    .acceso-denegado-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
    }
    .acceso-denegado-content {
      text-align: center;
      max-width: 500px;
    }
    .acceso-denegado-title {
      font-size: 6rem;
      margin: 0;
      color: #f44336;
    }
    .acceso-denegado-subtitle {
      font-size: 2rem;
      margin: 0 0 20px 0;
      color: #333;
    }
    .acceso-denegado-message {
      font-size: 1.2rem;
      margin-bottom: 30px;
      color: #666;
    }
    .acceso-denegado-button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3f51b5;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    .acceso-denegado-button:hover {
      background-color: #303f9f;
    }
  `,
  ],
})
export class AccesoDenegadoComponent {}

