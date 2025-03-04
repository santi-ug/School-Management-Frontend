import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { EvaluacionesService } from "../evaluaciones.service"
import  { AuthService } from "../../../core/services/auth.service"
import  { MatriculasService } from "../../matriculas/matriculas.service"
import  { NotaEvaluacion, Matricula } from "../../../shared/models/models"

@Component({
  selector: "app-mis-evaluaciones",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Mis Evaluaciones</h1>
      
      @if (loading) {
        <div class="loading">Cargando evaluaciones...</div>
      } @else if (notas.length === 0) {
        <div class="no-data">
          <p>No tienes evaluaciones registradas.</p>
        </div>
      } @else {
        <div class="cursos-container">
          @for (curso of getCursos(); track curso.id_curso) {
            <div class="curso-card">
              <div class="curso-header">
                <h2 class="curso-title">{{ curso.nombre }}</h2>
              </div>
              <div class="curso-content">
                <table class="evaluaciones-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (nota of getNotasByCurso(curso.id_curso); track nota.id_nota) {
                      <tr>
                        <td>{{ nota.evaluacion?.fecha_realizacion | date }}</td>
                        <td>{{ nota.calificacion | number:'1.1-1' }}</td>
                      </tr>
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td><strong>Promedio:</strong></td>
                      <td><strong>{{ getPromedioByCurso(curso.id_curso) | number:'1.1-1' }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
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
    .cursos-container {
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
    .curso-content {
      padding: 15px;
    }
    .evaluaciones-table {
      width: 100%;
      border-collapse: collapse;
    }
    .evaluaciones-table th, .evaluaciones-table td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .evaluaciones-table th {
      font-weight: 500;
      color: #666;
    }
    .evaluaciones-table tfoot {
      background-color: #f5f5f5;
    }
  `,
  ],
})
export class MisEvaluacionesComponent implements OnInit {
  notas: NotaEvaluacion[] = []
  matriculas: Matricula[] = []
  loading = true
  userId: string | null = null

  constructor(
    private evaluacionesService: EvaluacionesService,
    private matriculasService: MatriculasService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()
    this.loadData()
  }

  loadData(): void {
    this.loading = true

    if (this.userId) {
      // Primero cargamos las matrículas para saber en qué cursos está el estudiante
      this.matriculasService.getMatriculasByEstudiante(this.userId!).subscribe({
        next: (matriculas) => {
          this.matriculas = matriculas

          // Luego cargamos las notas de evaluación del estudiante
          this.evaluacionesService.getNotasEvaluacionByEstudiante(this.userId!).subscribe({
            next: (notas) => {
              this.notas = notas
              this.loading = false
            },
            error: (error) => {
              console.error("Error al cargar notas de evaluación", error)
              this.loading = false
            },
          })
        },
        error: (error) => {
          console.error("Error al cargar matrículas", error)
          this.loading = false
        },
      })
    } else {
      this.loading = false
    }
  }

  getCursos(): any[] {
    const cursosMap = new Map()

    this.matriculas.forEach((matricula) => {
      if (matricula.curso) {
        cursosMap.set(matricula.id_curso, matricula.curso)
      }
    })

    return Array.from(cursosMap.values())
  }

  getNotasByCurso(id_curso: string): NotaEvaluacion[] {
    return this.notas.filter((nota) => nota.evaluacion?.id_curso === id_curso)
  }

  getPromedioByCurso(id_curso: string): number {
    const notasCurso = this.getNotasByCurso(id_curso)

    if (notasCurso.length === 0) {
      return 0
    }

    const suma = notasCurso.reduce((acc, nota) => acc + nota.calificacion, 0)
    return suma / notasCurso.length
  }
}

