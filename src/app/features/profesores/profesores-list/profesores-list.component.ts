import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import { ProfesoresService } from "../profesores.service"
import type { Profesor } from "../../../shared/models/models"
import { ProfesorFormComponent } from "../profesor-form/profesor-form.component"

@Component({
  selector: "app-profesores-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, ProfesorFormComponent],
  template: `
    <div class="container">
      <h1>Profesores</h1>
      
      <app-data-table
        [data]="profesores"
        [columns]="columns"
        (onView)="viewProfesor($event)"
        (onEdit)="editProfesor($event)"
        (onDelete)="deleteProfesor($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-profesor-form
          [profesor]="selectedProfesor"
          [isEditing]="isEditing"
          (onSave)="saveProfesor($event)"
          (onCancel)="cancelForm()"
        ></app-profesor-form>
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
export class ProfesoresListComponent implements OnInit {
  profesores: Profesor[] = []
  selectedProfesor: Profesor | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_profesor", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "fecha_contratacion", label: "Fecha Contratación", format: "date" },
    { key: "departamento.nombre", label: "Departamento" },
  ]

  constructor(private profesoresService: ProfesoresService) {}

  ngOnInit(): void {
    this.loadProfesores()
  }

  loadProfesores(): void {
    this.profesoresService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data
      },
      error: (error) => {
        console.error("Error al cargar profesores", error)
      },
    })
  }

  viewProfesor(profesor: Profesor): void {
    this.selectedProfesor = profesor
    this.isEditing = false
    this.showForm = true
  }

  editProfesor(profesor: Profesor): void {
    this.selectedProfesor = { ...profesor }
    this.isEditing = true
    this.showForm = true
  }

  deleteProfesor(profesor: Profesor): void {
    if (confirm(`¿Está seguro de eliminar al profesor ${profesor.nombre}?`)) {
      this.profesoresService.deleteProfesor(profesor.id_profesor).subscribe({
        next: () => {
          this.loadProfesores()
        },
        error: (error) => {
          console.error("Error al eliminar profesor", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedProfesor = null
    this.isEditing = false
    this.showForm = true
  }

  saveProfesor(profesor: Profesor): void {
    if (this.isEditing) {
      this.profesoresService.updateProfesor(profesor).subscribe({
        next: () => {
          this.loadProfesores()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar profesor", error)
        },
      })
    } else {
      this.profesoresService.createProfesor(profesor).subscribe({
        next: () => {
          this.loadProfesores()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear profesor", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedProfesor = null
  }
}

