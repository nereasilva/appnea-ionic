import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { PhysiologicalData } from '../models/physiological-data.model';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhysiologicalDataService {
  constructor(private http: HttpClient) {}

  // Get data for the current patient (if user is a patient)
  getMyData(): Observable<PhysiologicalData[]> {
    return this.http.get<ApiResponse<PhysiologicalData[]>>(`${environment.apiUrl}/physiological-data/my-data`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get data for a specific patient (if user is a doctor)
  getPatientData(patientId: string): Observable<PhysiologicalData[]> {
    return this.http.get<ApiResponse<PhysiologicalData[]>>(`${environment.apiUrl}/physiological-data/patient/${patientId}`)
      .pipe(
        map(response => response.data)
      );
  }

  // For demo purposes: Generate mock data
  generateMockData(): Observable<PhysiologicalData[]> {
    return this.http.post<ApiResponse<PhysiologicalData[]>>(`${environment.apiUrl}/physiological-data/generate-mock`, {})
      .pipe(
        map(response => response.data)
      );
  }
}
