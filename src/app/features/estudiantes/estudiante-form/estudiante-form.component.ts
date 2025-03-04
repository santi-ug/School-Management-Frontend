import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { Estudiante } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"

@Component({
  selector: "app-estudiante-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Estudiante' : (estudiante ? 'Ver Estudiante' : 'Nuevo Estudiante')"
      [form]="estudianteForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_estudiante">ID</label>
        <input 
          type="text" 
          id="id_estudiante" 
          formControlName="id_estudiante"
          [readonly]="isEditing || !isEditing && estudiante"
          class="form-control"
        >
        @if (estudianteForm.get('id_estudiante')?.invalid && estudianteForm.get('id_estudiante')?.touched) {
          <div class="error-message">El ID es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          formControlName="nombre"
          [readonly]="!isEditing && estudiante"
          class="form-control"
        >
        @if (estudianteForm.get('nombre')?.invalid && estudianteForm.get('nombre')?.touched) {
          <div class="error-message">El nombre es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="fecha_nacimiento">Fecha de Nacimiento</label>
        <input 
          type="date" 
          id="fecha_nacimiento" 
          formControlName="fecha_nacimiento"
          [readonly]="!isEditing && estudiante"
          class="form-control"
        >
        @if (estudianteForm.get('fecha_nacimiento')?.invalid && estudianteForm.get('fecha_nacimiento')?.touched) {
          <div class="error-message">La fecha de nacimiento es requerida</div>
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
    .form-control:read-only {
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
export class EstudianteFormComponent implements OnInit {
  @Input() estudiante: Estudiante | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Estudiante>()
  @Output() onCancel = new EventEmitter<void>()

  estudianteForm!: FormGroup
  isSubmitting = false

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.estudianteForm = this.fb.group({
      id_estudiante: [{ value: this.estudiante?.id_estudiante || "", disabled: this.isEditing }, [Validators.required]],
      nombre: [this.estudiante?.nombre || "", [Validators.required]],
      fecha_nacimiento: [
        this.estudiante?.fecha_nacimiento ? new Date(this.estudiante.fecha_nacimiento).toISOString().split("T")[0] : "",
        [Validators.required],
      ],
    })

    if (!this.isEditing && this.estudiante) {
      this.estudianteForm.disable()
    }
  }

  onSubmit(): void {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.estudianteForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

