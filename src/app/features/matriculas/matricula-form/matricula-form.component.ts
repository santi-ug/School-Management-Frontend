import { Component, EventEmitter, Input,  OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Matricula, Estudiante, Curso } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"
import  { EstudiantesService } from "../../estudiantes/estudiantes.service"
import  { CursosService } from "../../cursos/cursos.service"

@Component({
  selector: "app-matricula-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Matrícula' : (matricula ? 'Ver Matrícula' : 'Nueva Matrícula')"
      [form]="matriculaForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_matricula">ID</label>
        <input 
          type="text" 
          id="id_matricula" 
          formControlName="id_matricula"
          [readonly]="isEditing || !isEditing && matricula"
          class="form-control"
        >
        @if (matriculaForm.get('id_matricula')?.invalid && matriculaForm.get('id_matricula')?.touched) {
          <div class="error-message">El ID es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_estudiante">Estudiante</label>
        <select 
          id="id_estudiante" 
          formControlName="id_estudiante"
          [disabled]="!isEditing && !!matricula"
          class="form-control"
        >
          <option value="">Seleccione un estudiante</option>
          @for (estudiante of estudiantes; track estudiante.id_estudiante) {
            <option [value]="estudiante.id_estudiante">{{ estudiante.nombre }}</option>
          }
        </select>
        @if (matriculaForm.get('id_estudiante')?.invalid && matriculaForm.get('id_estudiante')?.touched) {
          <div class="error-message">El estudiante es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_curso">Curso</label>
        <select 
          id="id_curso" 
          formControlName="id_curso"
          [disabled]="!isEditing && !!matricula"
          class="form-control"
        >
          <option value="">Seleccione un curso</option>
          @for (curso of cursos; track curso.id_curso) {
            <option [value]="curso.id_curso">{{ curso.nombre }}</option>
          }
        </select>
        @if (matriculaForm.get('id_curso')?.invalid && matriculaForm.get('id_curso')?.touched) {
          <div class="error-message">El curso es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="fecha_inscripcion">Fecha de Inscripción</label>
        <input 
          type="date" 
          id="fecha_inscripcion" 
          formControlName="fecha_inscripcion"
          [readonly]="!isEditing && matricula"
          class="form-control"
        >
        @if (matriculaForm.get('fecha_inscripcion')?.invalid && matriculaForm.get('fecha_inscripcion')?.touched) {
          <div class="error-message">La fecha de inscripción es requerida</div>
        }
      </div>
      
      <div class="form-group">
        <label for="calificacion_final">Calificación Final</label>
        <input 
          type="number" 
          id="calificacion_final" 
          formControlName="calificacion_final"
          [readonly]="!isEditing && matricula"
          class="form-control"
          step="0.1"
          min="0"
          max="10"
        >
      </div>
    </app-form-modal>
  `,
  styles: [
    `
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    .form-control:read-only, .form-control:disabled {
      background-color: #f5f5f5;
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }
  `,
  ],
})
export class MatriculaFormComponent implements OnInit {
  @Input() matricula: Matricula | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Matricula>()
  @Output() onCancel = new EventEmitter<void>()

  matriculaForm!: FormGroup
  isSubmitting = false
  estudiantes: Estudiante[] = []
  cursos: Curso[] = []

  constructor(
    private fb: FormBuilder,
    private estudiantesService: EstudiantesService,
    private cursosService: CursosService,
  ) {}

  ngOnInit(): void {
    this.loadEstudiantes()
    this.loadCursos()
    this.initForm()
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

  initForm(): void {
    this.matriculaForm = this.fb.group({
      id_matricula: [{ value: this.matricula?.id_matricula || "", disabled: this.isEditing }, [Validators.required]],
      id_estudiante: [this.matricula?.id_estudiante || "", [Validators.required]],
      id_curso: [this.matricula?.id_curso || "", [Validators.required]],
      fecha_inscripcion: [
        this.matricula?.fecha_inscripcion
          ? new Date(this.matricula.fecha_inscripcion).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        [Validators.required],
      ],
      calificacion_final: [this.matricula?.calificacion_final || 0],
    })

    if (!this.isEditing && this.matricula) {
      this.matriculaForm.disable()
    }
  }

  onSubmit(): void {
    if (this.matriculaForm.invalid) {
      this.matriculaForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.matriculaForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

