import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { Matricula } from "../../shared/models/models"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class MatriculasService {
  private readonly API_URL = `${environment.apiUrl}/matriculas`

  constructor(private http: HttpClient) {}

  getMatriculas(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.API_URL)
  }

  getMatricula(id: string): Observable<Matricula> {
    return this.http.get<Matricula>(`${this.API_URL}/${id}`)
  }

  createMatricula(matricula: Matricula): Observable<Matricula> {
    return this.http.post<Matricula>(this.API_URL, matricula)
  }

  updateMatricula(matricula: Matricula): Observable<Matricula> {
    return this.http.put<Matricula>(`${this.API_URL}/${matricula.id_matricula}`, matricula)
  }

  deleteMatricula(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }

  getMatriculasByEstudiante(id_estudiante: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.API_URL}/estudiante/${id_estudiante}`)
  }

  getMatriculasByCurso(id_curso: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.API_URL}/curso/${id_curso}`)
  }
}

