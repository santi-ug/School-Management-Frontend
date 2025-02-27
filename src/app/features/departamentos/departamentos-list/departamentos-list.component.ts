import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import { DepartamentosService } from "../departamentos.service"
import type { Departamento } from "../../../shared/models/models"
import { DepartamentoFormComponent } from "../departamento-form/departamento-form.component"

@Component({
  selector: "app-departamentos-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, DepartamentoFormComponent],
  template: `
    <div class="container">
      <h1>Departamentos</h1>
      
      <app-data-table
        [data]="departamentos"
        [columns]="columns"
        (onView)="viewDepartamento($event)"
        (onEdit)="editDepartamento($event)"
        (onDelete)="deleteDepartamento($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-departamento-form
          [departamento]="selectedDepartamento"
          [isEditing]="isEditing"
          (onSave)="saveDepartamento($event)"
          (onCancel)="cancelForm()"
        ></app-departamento-form>
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
export class DepartamentosListComponent implements OnInit {
  departamentos: Departamento[] = []
  selectedDepartamento: Departamento | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_departamento", label: "Código" },
    { key: "nombre", label: "Nombre" },
  ]

  constructor(private departamentosService: DepartamentosService) {}

  ngOnInit(): void {
    this.loadDepartamentos()
  }

  loadDepartamentos(): void {
    this.departamentosService.getDepartamentos().subscribe({
      next: (data) => {
        this.departamentos = data
      },
      error: (error) => {
        console.error("Error al cargar departamentos", error)
      },
    })
  }

  viewDepartamento(departamento: Departamento): void {
    this.selectedDepartamento = departamento
    this.isEditing = false
    this.showForm = true
  }

  editDepartamento(departamento: Departamento): void {
    this.selectedDepartamento = { ...departamento }
    this.isEditing = true
    this.showForm = true
  }

  deleteDepartamento(departamento: Departamento): void {
    if (confirm(`¿Está seguro de eliminar el departamento ${departamento.nombre}?`)) {
      this.departamentosService.deleteDepartamento(departamento.id_departamento).subscribe({
        next: () => {
          this.loadDepartamentos()
        },
        error: (error) => {
          console.error("Error al eliminar departamento", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedDepartamento = null
    this.isEditing = false
    this.showForm = true
  }

  saveDepartamento(departamento: Departamento): void {
    if (this.isEditing) {
      this.departamentosService.updateDepartamento(departamento).subscribe({
        next: () => {
          this.loadDepartamentos()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar departamento", error)
        },
      })
    } else {
      this.departamentosService.createDepartamento(departamento).subscribe({
        next: () => {
          this.loadDepartamentos()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear departamento", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedDepartamento = null
  }
}

