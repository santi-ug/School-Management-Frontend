import { Injectable } from "@angular/core"
import type { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Curso } from "../../shared/models/models"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class CursosService {
  private readonly API_URL = `${environment.apiUrl}/cursos`

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API_URL)
  }

  getCurso(id: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.API_URL}/${id}`)
  }

  createCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.API_URL, curso)
  }

  updateCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.API_URL}/${curso.id_curso}`, curso)
  }

  deleteCurso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }

  getPrerrequisitos(id: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.API_URL}/${id}/prerrequisitos`)
  }
}

