import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { Evaluacion, NotaEvaluacion } from "../../shared/models/models"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class EvaluacionesService {
  private readonly API_URL = `${environment.apiUrl}/evaluaciones`
  private readonly NOTAS_API_URL = `${environment.apiUrl}/notas-evaluacion`

  constructor(private http: HttpClient) {}

  getEvaluaciones(): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(this.API_URL)
  }

  getEvaluacion(id: string): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.API_URL}/${id}`)
  }

  createEvaluacion(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(this.API_URL, evaluacion)
  }

  updateEvaluacion(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.put<Evaluacion>(`${this.API_URL}/${evaluacion.id_evaluacion}`, evaluacion)
  }

  deleteEvaluacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }

  getEvaluacionesByCurso(id_curso: string): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.API_URL}/curso/${id_curso}`)
  }

  // Notas de evaluación
  getNotasEvaluacion(id_evaluacion: string): Observable<NotaEvaluacion[]> {
    return this.http.get<NotaEvaluacion[]>(`${this.NOTAS_API_URL}/evaluacion/${id_evaluacion}`)
  }

  getNotaEvaluacion(id_evaluacion: string, id_nota: string): Observable<NotaEvaluacion> {
    return this.http.get<NotaEvaluacion>(`${this.NOTAS_API_URL}/${id_nota}`)
  }

  createNotaEvaluacion(nota: NotaEvaluacion): Observable<NotaEvaluacion> {
    return this.http.post<NotaEvaluacion>(this.NOTAS_API_URL, nota)
  }

  updateNotaEvaluacion(nota: NotaEvaluacion): Observable<NotaEvaluacion> {
    return this.http.put<NotaEvaluacion>(`${this.NOTAS_API_URL}/${nota.id_nota}`, nota)
  }

  deleteNotaEvaluacion(id_nota: string): Observable<void> {
    return this.http.delete<void>(`${this.NOTAS_API_URL}/${id_nota}`)
  }

  getNotasEvaluacionByEstudiante(id_estudiante: string): Observable<NotaEvaluacion[]> {
    return this.http.get<NotaEvaluacion[]>(`${this.NOTAS_API_URL}/estudiante/${id_estudiante}`)
  }
}

