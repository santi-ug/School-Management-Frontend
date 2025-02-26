import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import type { DepartamentosService } from "../departamentos/departamentos.service"
import type { ProfesoresService } from "../profesores/profesores.service"
import type { EstudiantesService } from "../estudiantes/estudiantes.service"
import type { CursosService } from "../cursos/cursos.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <h1 class="dashboard-title">Dashboard</h1>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon departamentos-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="stat-content">
            <h2 class="stat-title">Departamentos</h2>
            <p class="stat-value">{{ stats.departamentos }}</p>
          </div>
          <a routerLink="/departamentos" class="stat-link">Ver todos</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon profesores-icon">
            <i class="fas fa-chalkboard-teacher"></i>
          </div>
          <div class="stat-content">
            <h2 class="stat-title">Profesores</h2>
            <p class="stat-value">{{ stats.profesores }}</p>
          </div>
          <a routerLink="/profesores" class="stat-link">Ver todos</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon estudiantes-icon">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div class="stat-content">
            <h2 class="stat-title">Estudiantes</h2>
            <p class="stat-value">{{ stats.estudiantes }}</p>
          </div>
          <a routerLink="/estudiantes" class="stat-link">Ver todos</a>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon cursos-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="stat-content">
            <h2 class="stat-title">Cursos</h2>
            <p class="stat-value">{{ stats.cursos }}</p>
          </div>
          <a routerLink="/cursos" class="stat-link">Ver todos</a>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2 class="section-title">Acciones Rápidas</h2>
        <div class="actions-container">
          <a routerLink="/departamentos" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nuevo Departamento</span>
          </a>
          
          <a routerLink="/profesores" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nuevo Profesor</span>
          </a>
          
          <a routerLink="/estudiantes" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nuevo Estudiante</span>
          </a>
          
          <a routerLink="/cursos" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nuevo Curso</span>
          </a>
          
          <a routerLink="/matriculas" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nueva Matrícula</span>
          </a>
          
          <a routerLink="/evaluaciones" class="action-card">
            <div class="action-icon">
              <i class="fas fa-plus"></i>
            </div>
            <span class="action-text">Nueva Evaluación</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      padding: 20px;
    }
    .dashboard-title {
      margin-bottom: 20px;
      color: #333;
    }
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      color: white;
      font-size: 24px;
    }
    .departamentos-icon {
      background-color: #3f51b5;
    }
    .profesores-icon {
      background-color: #f44336;
    }
    .estudiantes-icon {
      background-color: #4caf50;
    }
    .cursos-icon {
      background-color: #ff9800;
    }
    .stat-content {
      flex: 1;
    }
    .stat-title {
      font-size: 16px;
      color: #666;
      margin: 0 0 5px 0;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      color: #333;
    }
    .stat-link {
      display: block;
      text-align: right;
      color: #3f51b5;
      text-decoration: none;
      margin-top: 10px;
    }
    .section-title {
      margin-bottom: 15px;
      color: #333;
    }
    .quick-actions {
      margin-top: 20px;
    }
    .actions-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }
    .action-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 15px;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .action-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .action-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
    .action-text {
      font-weight: 500;
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  stats = {
    departamentos: 0,
    profesores: 0,
    estudiantes: 0,
    cursos: 0,
  }

  constructor(
    private departamentosService: DepartamentosService,
    private profesoresService: ProfesoresService,
    private estudiantesService: EstudiantesService,
    private cursosService: CursosService,
  ) {}

  ngOnInit(): void {
    this.loadStats()
  }

  loadStats(): void {
    this.departamentosService.getDepartamentos().subscribe({
      next: (data) => {
        this.stats.departamentos = data.length
      },
    })

    this.profesoresService.getProfesores().subscribe({
      next: (data) => {
        this.stats.profesores = data.length
      },
    })

    this.estudiantesService.getEstudiantes().subscribe({
      next: (data) => {
        this.stats.estudiantes = data.length
      },
    })

    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.stats.cursos = data.length
      },
    })
  }
}

