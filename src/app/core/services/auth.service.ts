import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { type Observable, BehaviorSubject, tap } from "rxjs"
import  { Router } from "@angular/router"
import { environment } from "../../../environments/environment"

interface LoginResponse {
  access_token: string
  user: {
    id: string
    username: string
    nombre: string
    email: string
    rol: string
  }
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "user_data"

  private authSubject = new BehaviorSubject<boolean>(this.isLoggedIn())

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token)
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
        this.authSubject.next(true)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.authSubject.next(false)
    this.router.navigate(["/login"])
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  getAuthState(): Observable<boolean> {
    return this.authSubject.asObservable()
  }

  getUserRole(): string | null {
    const userData = localStorage.getItem(this.USER_KEY)
    if (userData) {
      const user = JSON.parse(userData)
      return user.rol
    }
    return null
  }
  
  getUserId(): string | null {
    const userData = this.getUserData()
    return userData ? userData.id : null
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.USER_KEY)
    if (userData) {
      return JSON.parse(userData)
    }
    return null
  }

  
}

