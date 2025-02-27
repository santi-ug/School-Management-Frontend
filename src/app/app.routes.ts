// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamentos',
    loadChildren: () => import('./features/departamentos/departamentos.routes').then(m => m.DEPARTAMENTOS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'profesores',
    loadChildren: () => import('./features/profesores/profesores.routes').then(m => m.PROFESORES_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];