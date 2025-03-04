import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const roleGuard = (allowedRoles: string[]) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const userRole = authService.getUserRole()

  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigate(["/acceso-denegado"])
    return false
  }

  return true
}

