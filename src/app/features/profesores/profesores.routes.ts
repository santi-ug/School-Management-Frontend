import type { Routes } from "@angular/router"
import { ProfesoresListComponent } from "./profesores-list/profesores-list.component"

export const PROFESORES_ROUTES: Routes = [
  {
    path: "",
    component: ProfesoresListComponent,
  },
]

