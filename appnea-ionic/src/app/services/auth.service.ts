import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string, name?: string) {
    return this.http
      .post<{ success: boolean, user: User }>(`${environment.apiUrl}/auth/signup`, {
        email,
        password,
        name
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user._id,
            resData.user.email,
            resData.user.name,
            resData.user.role
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<{ success: boolean, user: User }>(`${environment.apiUrl}/auth/login`, {
        email,
        password
      })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.user._id,
            resData.user.email,
            resData.user.name,
            resData.user.role
          );
        })
      );
  }

  autoLogin() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const parsedData: {
      _id: string;
      email: string;
      name?: string;
      role: 'Patient' | 'Doctor' | null;
    } = JSON.parse(userData);

    const loadedUser: User = {
      _id: parsedData._id,
      email: parsedData.email,
      name: parsedData.name,
      role: parsedData.role
    };

    this.user.next(loadedUser);

    // Navigate to appropriate page based on role
    setTimeout(() => {
      if (loadedUser.role === 'Patient') {
        this.router.navigate(['/patient-dashboard'], { replaceUrl: true });
      } else if (loadedUser.role === 'Doctor') {
        this.router.navigate(['/doctor-dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/role-selection'], { replaceUrl: true });
      }
    }, 100);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  setRole(role: 'Patient' | 'Doctor') {
    const currentUser = this.user.value;
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Check if user already has a role
    if (currentUser.role) {
      return throwError(() => new Error('You already have a role assigned. Please contact support if you need to change your role.'));
    }

    return this.http
      .post<{ success: boolean, data: User }>(`${environment.apiUrl}/users/set-role`, { role })
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          // Handle different response structures
          const userData = resData.data || (resData as any).user;

          if (!userData) {
            console.error('Invalid response format:', resData);
            throw new Error('Invalid server response');
          }

          const updatedUser: User = {
            ...currentUser,
            role: userData.role
          };

          this.user.next(updatedUser);
          localStorage.setItem('userData', JSON.stringify({
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role
          }));

          // Navigate to appropriate dashboard
          setTimeout(() => {
            if (updatedUser.role === 'Patient') {
              this.router.navigate(['/patient-dashboard'], { replaceUrl: true });
            } else if (updatedUser.role === 'Doctor') {
              this.router.navigate(['/doctor-dashboard'], { replaceUrl: true });
            }
          }, 100);
        })
      );
  }

  private handleAuthentication(
    userId: string,
    email: string,
    name: string | undefined,
    role: 'Patient' | 'Doctor' | null
  ) {
    const user: User = {
      _id: userId,
      email: email,
      name: name,
      role: role
    };

    this.user.next(user);

    localStorage.setItem('userData', JSON.stringify({
      _id: userId,
      email: email,
      name: name,
      role: role
    }));

    // Navigate based on role
    setTimeout(() => {
      if (role === 'Patient') {
        this.router.navigate(['/patient-dashboard'], { replaceUrl: true });
      } else if (role === 'Doctor') {
        this.router.navigate(['/doctor-dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['/role-selection'], { replaceUrl: true });
      }
    }, 100);
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An unknown error occurred!';

    console.error('Auth error:', errorRes);

    if (!errorRes.error) {
      return throwError(() => new Error(errorMessage));
    }

    // Check for structured error response
    if (errorRes.error && typeof errorRes.error === 'object') {
      if (errorRes.error.message) {
        switch (errorRes.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct';
            break;
          case 'User role already set':
            errorMessage = 'You already have a role assigned. Please contact support if you need to change your role.';
            break;
          case 'Invalid role':
            errorMessage = 'The selected role is invalid. Please choose either Patient or Doctor.';
            break;
          default:
            errorMessage = errorRes.error.message || errorMessage;
        }
      } else if (errorRes.error.error && errorRes.error.error.message) {
        // Handle nested error objects
        errorMessage = errorRes.error.error.message;
      }
    } else if (typeof errorRes.error === 'string') {
      errorMessage = errorRes.error;
    }

    return throwError(() => new Error(errorMessage));
  }
}
