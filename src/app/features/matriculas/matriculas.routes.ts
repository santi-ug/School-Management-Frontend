import type { Routes } from "@angular/router"
import { MatriculasListComponent } from "./matriculas-list/matriculas-list.component"

export const MATRICULAS_ROUTES: Routes = [
  {
    path: "",
    component: MatriculasListComponent,
  },
]

