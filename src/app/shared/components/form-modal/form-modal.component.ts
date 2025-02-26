import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"
import { type FormGroup, ReactiveFormsModule } from "@angular/forms"

@Component({
  selector: "app-form-modal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-button" (click)="onClose.emit()">×</button>
        </div>
        <div class="modal-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit.emit(form.value)">
            <ng-content></ng-content>
            
            <div class="form-actions">
              <button type="button" class="cancel-button" (click)="onClose.emit()">Cancelar</button>
              <button 
                type="submit" 
                class="submit-button" 
                [disabled]="form.invalid || isSubmitting"
              >
                {{ submitButtonText }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eee;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-body {
      padding: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .cancel-button {
      padding: 8px 16px;
      background-color: #f1f1f1;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    .submit-button {
      padding: 8px 16px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  ],
})
export class FormModalComponent {
  @Input() title = "Formulario"
  @Input() form!: FormGroup
  @Input() isSubmitting = false
  @Input() submitButtonText = "Guardar"

  @Output() onSubmit = new EventEmitter<any>()
  @Output() onClose = new EventEmitter<void>()
}

