import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { DataTableComponent } from "../../../shared/components/data-table/data-table.component"
import  { CursosService } from "../cursos.service"
import  { Curso } from "../../../shared/models/models"
import { CursoFormComponent } from "../curso-form/curso-form.component"

@Component({
  selector: "app-cursos-list",
  standalone: true,
  imports: [CommonModule, DataTableComponent, CursoFormComponent],
  template: `
    <div class="container">
      <h1>Cursos</h1>
      
      <app-data-table
        [data]="cursos"
        [columns]="columns"
        (onView)="viewCurso($event)"
        (onEdit)="editCurso($event)"
        (onDelete)="deleteCurso($event)"
        (onAdd)="showAddForm()"
      ></app-data-table>
      
      @if (showForm) {
        <app-curso-form
          [curso]="selectedCurso"
          [isEditing]="isEditing"
          (onSave)="saveCurso($event)"
          (onCancel)="cancelForm()"
        ></app-curso-form>
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
export class CursosListComponent implements OnInit {
  cursos: Curso[] = []
  selectedCurso: Curso | null = null
  showForm = false
  isEditing = false

  columns = [
    { key: "id_curso", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "horario", label: "Horario" },
    { key: "profesor.nombre", label: "Profesor" },
  ]

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.loadCursos()
  }

  loadCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (data) => {
        this.cursos = data
      },
      error: (error) => {
        console.error("Error al cargar cursos", error)
      },
    })
  }

  viewCurso(curso: Curso): void {
    this.selectedCurso = curso
    this.isEditing = false
    this.showForm = true
  }

  editCurso(curso: Curso): void {
    this.selectedCurso = { ...curso }
    this.isEditing = true
    this.showForm = true
  }

  deleteCurso(curso: Curso): void {
    if (confirm(`¿Está seguro de eliminar el curso ${curso.nombre}?`)) {
      this.cursosService.deleteCurso(curso.id_curso).subscribe({
        next: () => {
          this.loadCursos()
        },
        error: (error) => {
          console.error("Error al eliminar curso", error)
        },
      })
    }
  }

  showAddForm(): void {
    this.selectedCurso = null
    this.isEditing = false
    this.showForm = true
  }

  saveCurso(curso: Curso): void {
    if (this.isEditing) {
      this.cursosService.updateCurso(curso).subscribe({
        next: () => {
          this.loadCursos()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al actualizar curso", error)
        },
      })
    } else {
      this.cursosService.createCurso(curso).subscribe({
        next: () => {
          this.loadCursos()
          this.cancelForm()
        },
        error: (error) => {
          console.error("Error al crear curso", error)
        },
      })
    }
  }

  cancelForm(): void {
    this.showForm = false
    this.selectedCurso = null
  }
}

