import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { Departamento } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"

@Component({
  selector: "app-departamento-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Departamento' : (departamento ? 'Ver Departamento' : 'Nuevo Departamento')"
      [form]="departamentoForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_departamento">Código</label>
        <input 
          type="text" 
          id="id_departamento" 
          formControlName="id_departamento"
          [readonly]="isEditing || !isEditing && !departamento"
          class="form-control"
        >
        @if (departamentoForm.get('id_departamento')?.invalid && departamentoForm.get('id_departamento')?.touched) {
          <div class="error-message">El código es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          formControlName="nombre"
          [readonly]="!isEditing && departamento"
          class="form-control"
        >
        @if (departamentoForm.get('nombre')?.invalid && departamentoForm.get('nombre')?.touched) {
          <div class="error-message">El nombre es requerido</div>
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
export class DepartamentoFormComponent implements OnInit {
  @Input() departamento: Departamento | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Departamento>()
  @Output() onCancel = new EventEmitter<void>()

  departamentoForm!: FormGroup
  isSubmitting = false

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.departamentoForm = this.fb.group({
      id_departamento: [
        { value: this.departamento?.id_departamento || "", disabled: this.isEditing },
        [Validators.required],
      ],
      nombre: [this.departamento?.nombre || "", [Validators.required]],
    })

    if (!this.isEditing && this.departamento) {
      this.departamentoForm.disable()
    }
  }

  onSubmit(): void {
    if (this.departamentoForm.invalid) {
      this.departamentoForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.departamentoForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

