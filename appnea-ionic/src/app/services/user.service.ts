import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/me`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get all patients (for doctors)
  getPatients(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users/patients`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get all doctors (for patients)
  getDoctors(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users/doctors`)
      .pipe(
        map(response => response.data)
      );
  }

  // Update user profile
  updateProfile(userData: { name?: string }): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${environment.apiUrl}/users/profile`, userData)
      .pipe(
        map(response => response.data)
      );
  }
}
