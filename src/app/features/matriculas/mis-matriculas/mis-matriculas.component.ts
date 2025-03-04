import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { MatriculasService } from "../matriculas.service"
import  { AuthService } from "../../../core/services/auth.service"
import  { Matricula } from "../../../shared/models/models"

@Component({
  selector: "app-mis-matriculas",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Mis Matrículas</h1>
      
      @if (loading) {
        <div class="loading">Cargando matrículas...</div>
      } @else if (matriculas.length === 0) {
        <div class="no-data">
          <p>No tienes matrículas registradas.</p>
          <p>Contacta con administración para matricularte en cursos.</p>
        </div>
      } @else {
        <div class="table-container">
          <table class="matriculas-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Fecha de Inscripción</th>
                <th>Calificación Final</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (matricula of matriculas; track matricula.id_matricula) {
                <tr>
                  <td>{{ matricula.curso?.nombre }}</td>
                  <td>{{ matricula.fecha_inscripcion | date }}</td>
                  <td>
                    @if (matricula.calificacion_final !== null && matricula.calificacion_final !== undefined) {
                      {{ matricula.calificacion_final | number:'1.1-1' }}
                    } @else {
                      Pendiente
                    }
                  </td>
                  <td>
                    <span class="estado" [ngClass]="getEstadoClass(matricula)">
                      {{ getEstadoText(matricula) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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
    .table-container {
      overflow-x: auto;
      margin-top: 20px;
    }
    .matriculas-table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .matriculas-table th, .matriculas-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .matriculas-table th {
      background-color: #3f51b5;
      color: white;
      font-weight: 500;
    }
    .matriculas-table tr:last-child td {
      border-bottom: none;
    }
    .matriculas-table tr:hover {
      background-color: #f9f9f9;
    }
    .estado {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .estado-aprobado {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .estado-reprobado {
      background-color: #ffebee;
      color: #c62828;
    }
    .estado-pendiente {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    .estado-en-curso {
      background-color: #fff8e1;
      color: #f57f17;
    }
  `,
  ],
})
export class MisMatriculasComponent implements OnInit {
  matriculas: Matricula[] = []
  loading = true
  userId: string | null = null

  constructor(
    private matriculasService: MatriculasService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId()
    this.loadMatriculas()
  }

  loadMatriculas(): void {
    this.loading = true

    if (this.userId) {
      this.matriculasService.getMatriculasByEstudiante(this.userId!).subscribe({
        next: (data) => {
          this.matriculas = data
          this.loading = false
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

  getEstadoText(matricula: Matricula): string {
    if (matricula.calificacion_final === null || matricula.calificacion_final === undefined) {
      return "En curso"
    }

    if (matricula.calificacion_final >= 6) {
      return "Aprobado"
    } else {
      return "Reprobado"
    }
  }

  getEstadoClass(matricula: Matricula): string {
    if (matricula.calificacion_final === null || matricula.calificacion_final === undefined) {
      return "estado-en-curso"
    }

    if (matricula.calificacion_final >= 6) {
      return "estado-aprobado"
    } else {
      return "estado-reprobado"
    }
  }
}

