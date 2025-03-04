import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { NotaEvaluacion, Estudiante, Evaluacion } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"
import { EstudiantesService } from "../../estudiantes/estudiantes.service"

@Component({
  selector: "app-nota-evaluacion-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Nota' : (nota ? 'Ver Nota' : 'Nueva Nota')"
      [form]="notaForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_nota">ID</label>
        <input 
          type="text" 
          id="id_nota" 
          formControlName="id_nota"
          [readonly]="isEditing || !isEditing && nota"
          class="form-control"
        >
        @if (notaForm.get('id_nota')?.invalid && notaForm.get('id_nota')?.touched) {
          <div class="error-message">El ID es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_estudiante">Estudiante</label>
        <select 
          id="id_estudiante" 
          formControlName="id_estudiante"
          [disabled]="!isEditing && !!nota"
          class="form-control"
        >
          <option value="">Seleccione un estudiante</option>
          @for (estudiante of estudiantes; track estudiante.id_estudiante) {
            <option [value]="estudiante.id_estudiante">{{ estudiante.nombre }}</option>
          }
        </select>
        @if (notaForm.get('id_estudiante')?.invalid && notaForm.get('id_estudiante')?.touched) {
          <div class="error-message">El estudiante es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="calificacion">Calificación</label>
        <input 
          type="number" 
          id="calificacion" 
          formControlName="calificacion"
          [readonly]="!isEditing && nota"
          class="form-control"
          step="0.1"
          min="0"
          max="10"
        >
        @if (notaForm.get('calificacion')?.invalid && notaForm.get('calificacion')?.touched) {
          <div class="error-message">La calificación es requerida y debe estar entre 0 y 10</div>
        }
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
export class NotaEvaluacionFormComponent implements OnInit {
  @Input() nota: NotaEvaluacion | null = null
  @Input() evaluacion: Evaluacion | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<NotaEvaluacion>()
  @Output() onCancel = new EventEmitter<void>()

  notaForm!: FormGroup
  isSubmitting = false
  estudiantes: Estudiante[] = []

  constructor(
    private fb: FormBuilder,
    private estudiantesService: EstudiantesService,
  ) {}

  ngOnInit(): void {
    this.loadEstudiantes()
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

  initForm(): void {
    this.notaForm = this.fb.group({
      id_nota: [{ value: this.nota?.id_nota || "", disabled: this.isEditing }, [Validators.required]],
      id_estudiante: [this.nota?.id_estudiante || "", [Validators.required]],
      calificacion: [this.nota?.calificacion || 0, [Validators.required, Validators.min(0), Validators.max(10)]],
    })

    if (!this.isEditing && this.nota) {
      this.notaForm.disable()
    }
  }

  onSubmit(): void {
    if (this.notaForm.invalid) {
      this.notaForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.notaForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

