import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { Evaluacion, Curso } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"
import { CursosService } from "../../cursos/cursos.service"

@Component({
  selector: "app-evaluacion-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Evaluación' : (evaluacion ? 'Ver Evaluación' : 'Nueva Evaluación')"
      [form]="evaluacionForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_evaluacion">ID</label>
        <input 
          type="text" 
          id="id_evaluacion" 
          formControlName="id_evaluacion"
          [readonly]="isEditing || !isEditing && evaluacion"
          class="form-control"
        >
        @if (evaluacionForm.get('id_evaluacion')?.invalid && evaluacionForm.get('id_evaluacion')?.touched) {
          <div class="error-message">El ID es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="fecha_realizacion">Fecha de Realización</label>
        <input 
          type="date" 
          id="fecha_realizacion" 
          formControlName="fecha_realizacion"
          [readonly]="!isEditing && evaluacion"
          class="form-control"
        >
        @if (evaluacionForm.get('fecha_realizacion')?.invalid && evaluacionForm.get('fecha_realizacion')?.touched) {
          <div class="error-message">La fecha de realización es requerida</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_curso">Curso</label>
        <select 
          id="id_curso" 
          formControlName="id_curso"
          [disabled]="!isEditing && !!evaluacion"
          class="form-control"
        >
          <option value="">Seleccione un curso</option>
          @for (curso of cursos; track curso.id_curso) {
            <option [value]="curso.id_curso">{{ curso.nombre }}</option>
          }
        </select>
        @if (evaluacionForm.get('id_curso')?.invalid && evaluacionForm.get('id_curso')?.touched) {
          <div class="error-message">El curso es requerido</div>
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
export class EvaluacionFormComponent implements OnInit {
  @Input() evaluacion: Evaluacion | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Evaluacion>()
  @Output() onCancel = new EventEmitter<void>()

  evaluacionForm!: FormGroup
  isSubmitting = false
  cursos: Curso[] = []

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
  ) {}

  ngOnInit(): void {
    this.loadCursos()
    this.initForm()
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
    this.evaluacionForm = this.fb.group({
      id_evaluacion: [{ value: this.evaluacion?.id_evaluacion || "", disabled: this.isEditing }, [Validators.required]],
      fecha_realizacion: [
        this.evaluacion?.fecha_realizacion
          ? new Date(this.evaluacion.fecha_realizacion).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        [Validators.required],
      ],
      id_curso: [this.evaluacion?.id_curso || "", [Validators.required]],
    })

    if (!this.isEditing && this.evaluacion) {
      this.evaluacionForm.disable()
    }
  }

  onSubmit(): void {
    if (this.evaluacionForm.invalid) {
      this.evaluacionForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.evaluacionForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

