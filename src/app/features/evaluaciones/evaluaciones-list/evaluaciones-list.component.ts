import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import { EvaluacionesService } from "../evaluaciones.service"
import type { Evaluacion } from "../../../shared/models/models"
import { EvaluacionFormComponent } from "../evaluacion-form/evaluacion-form.component"
import { Router } from "@angular/router"

@Component({
  selector: "app-evaluaciones-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, EvaluacionFormComponent],
  template: `
    <div class="container">
      <h1>Evaluaciones</h1>
      
      <app-data-table
        [data]="evaluaciones"
        [columns]="columns"
        (onView)="viewEvaluacion($event)"
        (onEdit)="editEvaluacion($event)"
        (onDelete)="deleteEvaluacion($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-evaluacion-form
          [evaluacion]="selectedEvaluacion"
          [isEditing]="isEditing"
          (onSave)="saveEvaluacion($event)"
          (onCancel)="cancelForm()"
        ></app-evaluacion-form>
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
export class EvaluacionesListComponent implements OnInit {
  evaluaciones: Evaluacion[] = []
  selectedEvaluacion: Evaluacion | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_evaluacion", label: "ID" },
    { key: "fecha_realizacion", label: "Fecha de Realización", format: "date" },
    { key: "curso.nombre", label: "Curso" },
  ]

  constructor(
    private evaluacionesService: EvaluacionesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEvaluaciones()
  }

  loadEvaluaciones(): void {
    this.evaluacionesService.getEvaluaciones().subscribe({
      next: (data) => {
        this.evaluaciones = data
      },
      error: (error) => {
        console.error("Error al cargar evaluaciones", error)
      },
    })
  }

  viewEvaluacion(evaluacion: Evaluacion): void {
    // Navigate to notas-evaluacion with the evaluacion id
    this.router.navigate(["/evaluaciones", evaluacion.id_evaluacion, "notas"])
  }

  editEvaluacion(evaluacion: Evaluacion): void {
    this.selectedEvaluacion = { ...evaluacion }
    this.isEditing = true
    this.showForm = true
  }

  deleteEvaluacion(evaluacion: Evaluacion): void {
    if (confirm(`¿Está seguro de eliminar la evaluación del curso ${evaluacion.curso?.nombre}?`)) {
      this.evaluacionesService.deleteEvaluacion(evaluacion.id_evaluacion).subscribe({
        next: () => {
          this.loadEvaluaciones()
        },
        error: (error) => {
          console.error("Error al eliminar evaluación", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedEvaluacion = null
    this.isEditing = false
    this.showForm = true
  }

  saveEvaluacion(evaluacion: Evaluacion): void {
    if (this.isEditing) {
      this.evaluacionesService.updateEvaluacion(evaluacion).subscribe({
        next: () => {
          this.loadEvaluaciones()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar evaluación", error)
        },
      })
    } else {
      this.evaluacionesService.createEvaluacion(evaluacion).subscribe({
        next: () => {
          this.loadEvaluaciones()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear evaluación", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedEvaluacion = null
  }
}

