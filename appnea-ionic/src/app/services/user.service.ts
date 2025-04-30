import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`);
  }

  // Get all patients (for doctors)
  getPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/patients`);
  }

  // Get all doctors (for patients)
  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/doctors`);
  }

  // Update user profile
  updateProfile(userData: { name?: string }): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/profile`, userData);
  }
}
