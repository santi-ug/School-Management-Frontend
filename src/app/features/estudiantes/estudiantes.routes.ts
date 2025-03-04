// src/app/features/estudiantes/estudiantes.routes.ts
import { Routes } from '@angular/router';
import { EstudiantesListComponent } from './estudiantes-list/estudiante-list.component';

export const ESTUDIANTES_ROUTES: Routes = [
  {
    path: '',
    component: EstudiantesListComponent
  }
];