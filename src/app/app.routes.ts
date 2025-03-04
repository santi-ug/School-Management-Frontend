import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"
import { roleGuard } from "./core/guards/role.guard"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./features/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "departamentos",
    loadChildren: () => import("./features/departamentos/departamentos.routes").then((m) => m.DEPARTAMENTOS_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin"])],
  },
  {
    path: "profesores",
    loadChildren: () => import("./features/profesores/profesores.routes").then((m) => m.PROFESORES_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin"])],
  },
  {
    path: "estudiantes",
    loadChildren: () => import("./features/estudiantes/estudiantes.routes").then((m) => m.ESTUDIANTES_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin", "profesor"])],
  },
  {
    path: "cursos",
    loadChildren: () => import("./features/cursos/cursos.routes").then((m) => m.CURSOS_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin", "profesor"])],
  },
  {
    path: "mis-cursos",
    loadComponent: () => import("./features/cursos/mis-cursos/mis-cursos.component").then((m) => m.MisCursosComponent),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["estudiante", "profesor"])],
  },
  {
    path: "matriculas",
    loadChildren: () => import("./features/matriculas/matriculas.routes").then((m) => m.MATRICULAS_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin", "profesor"])],
  },
  {
    path: "mis-matriculas",
    loadComponent: () =>
      import("./features/matriculas/mis-matriculas/mis-matriculas.component").then((m) => m.MisMatriculasComponent),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["estudiante"])],
  },
  {
    path: "evaluaciones",
    loadChildren: () => import("./features/evaluaciones/evaluaciones.routes").then((m) => m.EVALUACIONES_ROUTES),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["admin", "profesor"])],
  },
  {
    path: "mis-evaluaciones",
    loadComponent: () =>
      import("./features/evaluaciones/mis-evaluaciones/mis-evaluaciones.component").then(
        (m) => m.MisEvaluacionesComponent,
      ),
    canActivate: [authGuard],
    canMatch: [() => roleGuard(["estudiante"])],
  },
  {
    path: "acceso-denegado",
    loadComponent: () =>
      import("./core/components/acceso-denegado/acceso-denegado.component").then((m) => m.AccesoDenegadoComponent),
  },
  {
    path: "**",
    loadComponent: () => import("./core/components/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },
]

