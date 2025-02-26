import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Profesor } from "../../shared/models/models"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ProfesoresService {
  private readonly API_URL = `${environment.apiUrl}/profesores`

  constructor(private http: HttpClient) {}

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.API_URL)
  }

  getProfesor(id: string): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.API_URL}/${id}`)
  }

  createProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.post<Profesor>(this.API_URL, profesor)
  }

  updateProfesor(profesor: Profesor): Observable<Profesor> {
    return this.http.put<Profesor>(`${this.API_URL}/${profesor.id_profesor}`, profesor)
  }

  deleteProfesor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }
}

