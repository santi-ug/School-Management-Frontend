import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import  { EvaluacionesService } from "../evaluaciones.service"
import  { NotaEvaluacion, Evaluacion } from "../../../shared/models/models"
import { NotaEvaluacionFormComponent } from "./nota-evaluacion-form.component"

@Component({
  selector: "app-notas-evaluacion-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, NotaEvaluacionFormComponent],
  template: `
    <div class="container">
      <h1>Notas de Evaluación</h1>
      <h2 *ngIf="evaluacion">{{ evaluacion.curso?.nombre }} - {{ evaluacion.fecha_realizacion | date }}</h2>
      
      <app-data-table
        [data]="notas"
        [columns]="columns"
        (onView)="viewNota($event)"
        (onEdit)="editNota($event)"
        (onDelete)="deleteNota($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-nota-evaluacion-form
          [nota]="selectedNota"
          [evaluacion]="evaluacion"
          [isEditing]="isEditing"
          (onSave)="saveNota($event)"
          (onCancel)="cancelForm()"
        ></app-nota-evaluacion-form>
      }
    </div>
  `,
  styles: [
    `
    .container {
      padding: 20px;
    }
    h1, h2 {
      margin-bottom: 20px;
    }
  `,
  ],
})
export class NotasEvaluacionListComponent implements OnInit {
  notas: NotaEvaluacion[] = []
  selectedNota: NotaEvaluacion | null = null
  evaluacion: Evaluacion | null = null
  showForm = false
  isEditing = false
  evaluacionId = ""

  columns = [
    { key: "id_nota", label: "ID" },
    { key: "estudiante.nombre", label: "Estudiante" },
    { key: "calificacion", label: "Calificación", format: "decimal" },
  ]

  constructor(
    private evaluacionesService: EvaluacionesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.evaluacionId = params["id"]
      this.loadEvaluacion()
      this.loadNotas()
    })
  }

  loadEvaluacion(): void {
    this.evaluacionesService.getEvaluacion(this.evaluacionId).subscribe({
      next: (data) => {
        this.evaluacion = data
      },
      error: (error) => {
        console.error("Error al cargar evaluación", error)
      },
    })
  }

  loadNotas(): void {
    this.evaluacionesService.getNotasEvaluacion(this.evaluacionId).subscribe({
      next: (data) => {
        this.notas = data
      },
      error: (error) => {
        console.error("Error al cargar notas de evaluación", error)
      },
    })
  }

  viewNota(nota: NotaEvaluacion): void {
    this.selectedNota = nota
    this.isEditing = false
    this.showForm = true
  }

  editNota(nota: NotaEvaluacion): void {
    this.selectedNota = { ...nota }
    this.isEditing = true
    this.showForm = true
  }

  deleteNota(nota: NotaEvaluacion): void {
    if (confirm(`¿Está seguro de eliminar la nota del estudiante ${nota.estudiante?.nombre}?`)) {
      this.evaluacionesService.deleteNotaEvaluacion(nota.id_nota).subscribe({
        next: () => {
          this.loadNotas()
        },
        error: (error) => {
          console.error("Error al eliminar nota", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedNota = null
    this.isEditing = false
    this.showForm = true
  }

  saveNota(nota: NotaEvaluacion): void {
    // Add the evaluacion id
    nota.id_evaluacion = this.evaluacionId

    if (this.isEditing) {
      this.evaluacionesService.updateNotaEvaluacion(nota).subscribe({
        next: () => {
          this.loadNotas()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar nota", error)
        },
      })
    } else {
      this.evaluacionesService.createNotaEvaluacion(nota).subscribe({
        next: () => {
          this.loadNotas()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear nota", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedNota = null
  }
}

