import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import  { MatriculasService } from "../matriculas.service"
import  { Matricula } from "../../../shared/models/models"
import { MatriculaFormComponent } from "../matricula-form/matricula-form.component"

@Component({
  selector: "app-matriculas-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, MatriculaFormComponent],
  template: `
    <div class="container">
      <h1>Matrículas</h1>
      
      <app-data-table
        [data]="matriculas"
        [columns]="columns"
        (onView)="viewMatricula($event)"
        (onEdit)="editMatricula($event)"
        (onDelete)="deleteMatricula($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-matricula-form
          [matricula]="selectedMatricula"
          [isEditing]="isEditing"
          (onSave)="saveMatricula($event)"
          (onCancel)="cancelForm()"
        ></app-matricula-form>
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
  `,
  ],
})
export class MatriculasListComponent implements OnInit {
  matriculas: Matricula[] = []
  selectedMatricula: Matricula | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_matricula", label: "ID" },
    { key: "estudiante.nombre", label: "Estudiante" },
    { key: "curso.nombre", label: "Curso" },
    { key: "fecha_inscripcion", label: "Fecha de Inscripción", format: "date" },
    { key: "calificacion_final", label: "Calificación Final", format: "decimal" },
  ]

  constructor(private matriculasService: MatriculasService) {}

  ngOnInit(): void {
    this.loadMatriculas()
  }

  loadMatriculas(): void {
    this.matriculasService.getMatriculas().subscribe({
      next: (data) => {
        this.matriculas = data
      },
      error: (error) => {
        console.error("Error al cargar matrículas", error)
      },
    })
  }

  viewMatricula(matricula: Matricula): void {
    this.selectedMatricula = matricula
    this.isEditing = false
    this.showForm = true
  }

  editMatricula(matricula: Matricula): void {
    this.selectedMatricula = { ...matricula }
    this.isEditing = true
    this.showForm = true
  }

  deleteMatricula(matricula: Matricula): void {
    if (
      confirm(
        `¿Está seguro de eliminar la matrícula del estudiante ${matricula.estudiante?.nombre} en el curso ${matricula.curso?.nombre}?`,
      )
    ) {
      this.matriculasService.deleteMatricula(matricula.id_matricula).subscribe({
        next: () => {
          this.loadMatriculas()
        },
        error: (error) => {
          console.error("Error al eliminar matrícula", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedMatricula = null
    this.isEditing = false
    this.showForm = true
  }

  saveMatricula(matricula: Matricula): void {
    if (this.isEditing) {
      this.matriculasService.updateMatricula(matricula).subscribe({
        next: () => {
          this.loadMatriculas()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar matrícula", error)
        },
      })
    } else {
      this.matriculasService.createMatricula(matricula).subscribe({
        next: () => {
          this.loadMatriculas()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear matrícula", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedMatricula = null
  }
}

