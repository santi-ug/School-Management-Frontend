import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { Profesor, Departamento } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"
import type { DepartamentosService } from "../../departamentos/departamentos.service"

@Component({
  selector: "app-profesor-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Profesor' : (profesor ? 'Ver Profesor' : 'Nuevo Profesor')"
      [form]="profesorForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_profesor">ID</label>
        <input 
          type="text" 
          id="id_profesor" 
          formControlName="id_profesor"
          [readonly]="isEditing || !isEditing && profesor"
          class="form-control"
        >
        @if (profesorForm.get('id_profesor')?.invalid && profesorForm.get('id_profesor')?.touched) {
          <div class="error-message">El ID es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          formControlName="nombre"
          [readonly]="!isEditing && profesor"
          class="form-control"
        >
        @if (profesorForm.get('nombre')?.invalid && profesorForm.get('nombre')?.touched) {
          <div class="error-message">El nombre es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="fecha_contratacion">Fecha de Contratación</label>
        <input 
          type="date" 
          id="fecha_contratacion" 
          formControlName="fecha_contratacion"
          [readonly]="!isEditing && profesor"
          class="form-control"
        >
        @if (profesorForm.get('fecha_contratacion')?.invalid && profesorForm.get('fecha_contratacion')?.touched) {
          <div class="error-message">La fecha de contratación es requerida</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_departamento">Departamento</label>
        <select 
          id="id_departamento" 
          formControlName="id_departamento"
          [disabled]="!isEditing && profesor"
          class="form-control"
        >
          <option value="">Seleccione un departamento</option>
          @for (departamento of departamentos; track departamento.id_departamento) {
            <option [value]="departamento.id_departamento">{{ departamento.nombre }}</option>
          }
        </select>
        @if (profesorForm.get('id_departamento')?.invalid && profesorForm.get('id_departamento')?.touched) {
          <div class="error-message">El departamento es requerido</div>
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
export class ProfesorFormComponent implements OnInit {
  @Input() profesor: Profesor | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Profesor>()
  @Output() onCancel = new EventEmitter<void>()

  profesorForm!: FormGroup
  isSubmitting = false
  departamentos: Departamento[] = []

  constructor(
    private fb: FormBuilder,
    private departamentosService: DepartamentosService,
  ) {}

  ngOnInit(): void {
    this.loadDepartamentos()
    this.initForm()
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

  initForm(): void {
    this.profesorForm = this.fb.group({
      id_profesor: [{ value: this.profesor?.id_profesor || "", disabled: this.isEditing }, [Validators.required]],
      nombre: [this.profesor?.nombre || "", [Validators.required]],
      fecha_contratacion: [
        this.profesor?.fecha_contratacion ? new Date(this.profesor.fecha_contratacion).toISOString().split("T")[0] : "",
        [Validators.required],
      ],
      id_departamento: [this.profesor?.id_departamento || "", [Validators.required]],
    })

    if (!this.isEditing && this.profesor) {
      this.profesorForm.disable()
    }
  }

  onSubmit(): void {
    if (this.profesorForm.invalid) {
      this.profesorForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.profesorForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

