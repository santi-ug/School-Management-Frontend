// src/app/core/components/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <a routerLink="/" class="back-link">Volver al inicio</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #e91e63;
    }
    h2 {
      font-size: 2rem;
      margin: 0;
      color: #333;
    }
    p {
      margin: 1rem 0;
      color: #666;
    }
    .back-link {
      color: #2196f3;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid #2196f3;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    .back-link:hover {
      background-color: #2196f3;
      color: white;
    }
  `]
})
export class NotFoundComponent {}