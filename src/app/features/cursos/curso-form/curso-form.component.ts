import { Component, EventEmitter, Input,  OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import  { Curso, Profesor } from "../../../shared/models/models"
import { FormModalComponent } from "../../../shared/components/form-modal/form-modal.component"
import  { ProfesoresService } from "../../profesores/profesores.service"

@Component({
  selector: "app-curso-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormModalComponent],
  template: `
    <app-form-modal
      [title]="isEditing ? 'Editar Curso' : (curso ? 'Ver Curso' : 'Nuevo Curso')"
      [form]="cursoForm"
      [isSubmitting]="isSubmitting"
      (onSubmit)="onSubmit()"
      (onClose)="onCancel.emit()"
    >
      <div class="form-group">
        <label for="id_curso">Código</label>
        <input 
          type="text" 
          id="id_curso" 
          formControlName="id_curso"
          [readonly]="isEditing || !isEditing && curso"
          class="form-control"
        >
        @if (cursoForm.get('id_curso')?.invalid && cursoForm.get('id_curso')?.touched) {
          <div class="error-message">El código es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          formControlName="nombre"
          [readonly]="!isEditing && curso"
          class="form-control"
        >
        @if (cursoForm.get('nombre')?.invalid && cursoForm.get('nombre')?.touched) {
          <div class="error-message">El nombre es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea 
          id="descripcion" 
          formControlName="descripcion"
          [readonly]="!isEditing && curso"
          class="form-control"
          rows="3"
        ></textarea>
        @if (cursoForm.get('descripcion')?.invalid && cursoForm.get('descripcion')?.touched) {
          <div class="error-message">La descripción es requerida</div>
        }
      </div>
      
      <div class="form-group">
        <label for="horario">Horario</label>
        <input 
          type="text" 
          id="horario" 
          formControlName="horario"
          [readonly]="!isEditing && curso"
          class="form-control"
        >
        @if (cursoForm.get('horario')?.invalid && cursoForm.get('horario')?.touched) {
          <div class="error-message">El horario es requerido</div>
        }
      </div>
      
      <div class="form-group">
        <label for="id_profesor">Profesor</label>
        <select 
          id="id_profesor" 
          formControlName="id_profesor"
          [disabled]="!isEditing && !!curso"
          class="form-control"
        >
          <option value="">Seleccione un profesor</option>
          @for (profesor of profesores; track profesor.id_profesor) {
            <option [value]="profesor.id_profesor">{{ profesor.nombre }}</option>
          }
        </select>
        @if (cursoForm.get('id_profesor')?.invalid && cursoForm.get('id_profesor')?.touched) {
          <div class="error-message">El profesor es requerido</div>
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
export class CursoFormComponent implements OnInit {
  @Input() curso: Curso | null = null
  @Input() isEditing = false

  @Output() onSave = new EventEmitter<Curso>()
  @Output() onCancel = new EventEmitter<void>()

  cursoForm!: FormGroup
  isSubmitting = false
  profesores: Profesor[] = []

  constructor(
    private fb: FormBuilder,
    private profesoresService: ProfesoresService,
  ) {}

  ngOnInit(): void {
    this.loadProfesores()
    this.initForm()
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

  initForm(): void {
    this.cursoForm = this.fb.group({
      id_curso: [{ value: this.curso?.id_curso || "", disabled: this.isEditing }, [Validators.required]],
      nombre: [this.curso?.nombre || "", [Validators.required]],
      descripcion: [this.curso?.descripcion || "", [Validators.required]],
      horario: [this.curso?.horario || "", [Validators.required]],
      id_profesor: [this.curso?.id_profesor || "", [Validators.required]],
    })

    if (!this.isEditing && this.curso) {
      this.cursoForm.disable()
    }
  }

  onSubmit(): void {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true

    const formData = this.cursoForm.getRawValue()
    this.onSave.emit(formData)

    this.isSubmitting = false
  }
}

