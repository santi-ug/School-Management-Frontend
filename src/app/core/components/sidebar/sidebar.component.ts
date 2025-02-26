import { Component } from "@angular/core"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a routerLink="/departamentos" routerLinkActive="active">Departamentos</a>
          </li>
          <li class="nav-item">
            <a routerLink="/profesores" routerLinkActive="active">Profesores</a>
          </li>
          <li class="nav-item">
            <a routerLink="/estudiantes" routerLinkActive="active">Estudiantes</a>
          </li>
          <li class="nav-item">
            <a routerLink="/cursos" routerLinkActive="active">Cursos</a>
          </li>
          <li class="nav-item">
            <a routerLink="/matriculas" routerLinkActive="active">Matrículas</a>
          </li>
          <li class="nav-item">
            <a routerLink="/evaluaciones" routerLinkActive="active">Evaluaciones</a>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [
    `
    .sidebar {
      width: 250px;
      background-color: #f5f5f5;
      height: 100%;
      box-shadow: 1px 0 5px rgba(0,0,0,0.1);
    }
    .sidebar-nav {
      padding: 20px 0;
    }
    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .nav-item {
      margin-bottom: 5px;
    }
    .nav-item a {
      display: block;
      padding: 10px 20px;
      color: #333;
      text-decoration: none;
      transition: background-color 0.3s;
    }
    .nav-item a:hover {
      background-color: #e0e0e0;
    }
    .nav-item a.active {
      background-color: #3f51b5;
      color: white;
    }
  `,
  ],
})
export class SidebarComponent {}

