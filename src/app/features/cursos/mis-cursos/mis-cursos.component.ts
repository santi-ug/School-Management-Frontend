import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import  { CursosService } from "../cursos.service"
import  { AuthService } from "../../../core/services/auth.service"
import  { MatriculasService } from "../../matriculas/matriculas.service"
import  { Curso, Matricula } from "../../../shared/models/models"

@Component({
  selector: "app-mis-cursos",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <h1>Mis Cursos</h1>
      
      @if (loading) {
        <div class="loading">Cargando cursos...</div>
      } @else if (cursos.length === 0) {
        <div class="no-data">
          <p>No estás matriculado en ningún curso.</p>
          @if (isEstudiante) {
            <p>Contacta con administración para matricularte en cursos.</p>
          }
        </div>
      } @else {
        <div class="cursos-grid">
          @for (curso of cursos; track curso.id_curso) {
            <div class="curso-card">
              <div class="curso-header">
                <h2 class="curso-title">{{ curso.nombre }}</h2>
                @if (curso.profesor) {
                  <p class="curso-profesor">Prof. {{ curso.profesor.nombre }}</p>
                }
              </div>
              <div class="curso-content">
                <p class="curso-descripcion">{{ curso.descripcion }}</p>
                <p class="curso-horario"><strong>Horario:</strong> {{ curso.horario }}</p>
              </div>
              <div class="curso-footer">
                @if (isProfesor) {
                  <a [routerLink]="['/evaluaciones']" class="curso-button">Gestionar Evaluaciones</a>
                } @else {
                  <a [routerLink]="['/mis-evaluaciones']" class="curso-button">Ver Evaluaciones</a>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
    .container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
    }
    .loading, .no-data {
      text-align: center;
      padding: 40px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-top: 20px;
    }
    .cursos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .curso-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .curso-header {
      padding: 15px;
      background-color: #3f51b5;
      color: white;
    }
    .curso-title {
      margin: 0;
      font-size: 1.2rem;
    }
    .curso-profesor {
      margin: 5px 0 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    .curso-content {
      padding: 15px;
      flex: 1;
    }
    .curso-descripcion {
      margin-top: 0;
      margin-bottom: 15px;
    }
    .curso-horario {
      margin-bottom: 0;
      font-size: 0.9rem;
    }
    .curso-footer {
      padding: 15px;
      border-top: 1px solid #eee;
      text-align: right;
    }
    .curso-button {
      display: inline-block;
      padding: 8px 16px;
      background-color: #3f51b5;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }
    .curso-button:hover {
      background-color: #303f9f;
    }
  `,
  ],
})
export class MisCursosComponent implements OnInit {
  cursos: Curso[] = []
  loading = true
  userRole: string | null = null
  userId: string | null = null

  constructor(
    private cursosService: CursosService,
    private matriculasService: MatriculasService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole()
    this.userId = this.authService.getUserId()
    this.loadCursos()
  }

  get isEstudiante(): boolean {
    return this.userRole === "estudiante"
  }

  get isProfesor(): boolean {
    return this.userRole === "profesor"
  }

  loadCursos(): void {
    this.loading = true

    if (this.isProfesor && this.userId) {
      // Si es profesor, cargar los cursos que imparte
      this.cursosService.getCursosByProfesor(this.userId!).subscribe({
        next: (data) => {
          this.cursos = data
          this.loading = false
        },
        error: (error) => {
          console.error("Error al cargar cursos del profesor", error)
          this.loading = false
        },
      })
    } else if (this.isEstudiante && this.userId) {
      // Si es estudiante, cargar los cursos en los que está matriculado
      this.matriculasService.getMatriculasByEstudiante(this.userId!).subscribe({
        next: (matriculas: Matricula[]) => {
          // Para cada matrícula, obtener los detalles del curso
          const cursosPromises = matriculas.map((matricula) =>
            this.cursosService.getCurso(matricula.id_curso).toPromise(),
          )

          Promise.all(cursosPromises)
            .then((cursos) => {
              this.cursos = cursos.filter((curso) => curso !== undefined) as Curso[]
              this.loading = false
            })
            .catch((error) => {
              console.error("Error al cargar detalles de cursos", error)
              this.loading = false
            })
        },
        error: (error) => {
          console.error("Error al cargar matrículas del estudiante", error)
          this.loading = false
        },
      })
    } else {
      this.loading = false
    }
  }
}

