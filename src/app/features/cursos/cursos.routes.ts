import type { Routes } from "@angular/router"
import { CursosListComponent } from "./cursos-list/cursos-list.component"

export const CURSOS_ROUTES: Routes = [
  {
    path: "",
    component: CursosListComponent,
  },
]

