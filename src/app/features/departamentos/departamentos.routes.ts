import type { Routes } from "@angular/router"
import { DepartamentosListComponent } from "./departamentos-list/departamentos-list.component"

export const DEPARTAMENTOS_ROUTES: Routes = [
  {
    path: "",
    component: DepartamentosListComponent,
  },
]

