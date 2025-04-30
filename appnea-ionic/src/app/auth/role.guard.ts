import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = route.data['role'] as string;

    return this.authService.user.pipe(
      take(1),
      map(user => {
        // If user is not authenticated, redirect to login
        if (!user) {
          setTimeout(() => {
            this.router.navigate(['/login'], { replaceUrl: true });
          }, 100);
          return false;
        }

        // If user has no role yet, redirect to role selection
        if (user.role === null) {
          setTimeout(() => {
            this.router.navigate(['/role-selection'], { replaceUrl: true });
          }, 100);
          return false;
        }

        // Check if user has the required role
        if (user.role === requiredRole) {
          return true;
        }

        // If user has a different role, redirect to their appropriate dashboard
        setTimeout(() => {
          if (user.role === 'Patient') {
            this.router.navigate(['/patient-dashboard'], { replaceUrl: true });
          } else if (user.role === 'Doctor') {
            this.router.navigate(['/doctor-dashboard'], { replaceUrl: true });
          }
        }, 100);

        return false;
      })
    );
  }
}
