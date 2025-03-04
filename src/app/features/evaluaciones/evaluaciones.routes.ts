import type { Routes } from "@angular/router"
import { EvaluacionesListComponent } from "./evaluaciones-list/evaluaciones-list.component"
import { NotasEvaluacionListComponent } from "./notas-evaluacion/notas-evaluacion-list.component"

export const EVALUACIONES_ROUTES: Routes = [
  {
    path: "",
    component: EvaluacionesListComponent,
  },
  {
    path: ":id/notas",
    component: NotasEvaluacionListComponent,
  },
]

