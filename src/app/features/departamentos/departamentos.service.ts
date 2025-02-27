import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Departamento } from "../../shared/models/models"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class DepartamentosService {
  private readonly API_URL = `${environment.apiUrl}/departamentos`

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.API_URL)
  }

  getDepartamento(id: string): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.API_URL}/${id}`)
  }

  createDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.API_URL, departamento)
  }

  updateDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.API_URL}/${departamento.id_departamento}`, departamento)
  }

  deleteDepartamento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }
}

