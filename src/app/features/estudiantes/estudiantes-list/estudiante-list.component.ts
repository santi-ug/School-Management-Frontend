import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import { EstudiantesService } from "../estudiantes.service"
import type { Estudiante } from "../../../shared/models/models"
import { EstudianteFormComponent } from "../estudiante-form/estudiante-form.component"

@Component({
  selector: "app-estudiantes-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, EstudianteFormComponent],
  template: `
    <div class="container">
      <h1>Estudiantes</h1>
      
      <app-data-table
        [data]="estudiantes"
        [columns]="columns"
        (onView)="viewEstudiante($event)"
        (onEdit)="editEstudiante($event)"
        (onDelete)="deleteEstudiante($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-estudiante-form
          [estudiante]="selectedEstudiante"
          [isEditing]="isEditing"
          (onSave)="saveEstudiante($event)"
          (onCancel)="cancelForm()"
        ></app-estudiante-form>
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
export class EstudiantesListComponent implements OnInit {
  estudiantes: Estudiante[] = []
  selectedEstudiante: Estudiante | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_estudiante", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "fecha_nacimiento", label: "Fecha de Nacimiento", format: "date" },
  ]

  constructor(private estudiantesService: EstudiantesService) {}

  ngOnInit(): void {
    this.loadEstudiantes()
  }

  loadEstudiantes(): void {
    this.estudiantesService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data
      },
      error: (error) => {
        console.error("Error al cargar estudiantes", error)
      },
    })
  }

  viewEstudiante(estudiante: Estudiante): void {
    this.selectedEstudiante = estudiante
    this.isEditing = false
    this.showForm = true
  }

  editEstudiante(estudiante: Estudiante): void {
    this.selectedEstudiante = { ...estudiante }
    this.isEditing = true
    this.showForm = true
  }

  deleteEstudiante(estudiante: Estudiante): void {
    if (confirm(`¿Está seguro de eliminar al estudiante ${estudiante.nombre}?`)) {
      this.estudiantesService.deleteEstudiante(estudiante.id_estudiante).subscribe({
        next: () => {
          this.loadEstudiantes()
        },
        error: (error) => {
          console.error("Error al eliminar estudiante", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedEstudiante = null
    this.isEditing = false
    this.showForm = true
  }

  saveEstudiante(estudiante: Estudiante): void {
    if (this.isEditing) {
      this.estudiantesService.updateEstudiante(estudiante).subscribe({
        next: () => {
          this.loadEstudiantes()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar estudiante", error)
        },
      })
    } else {
      this.estudiantesService.createEstudiante(estudiante).subscribe({
        next: () => {
          this.loadEstudiantes()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear estudiante", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedEstudiante = null
  }
}

