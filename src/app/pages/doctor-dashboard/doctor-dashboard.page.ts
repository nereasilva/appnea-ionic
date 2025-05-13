import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PhysiologicalDataService } from '../../services/physiological-data.service';
import { User } from '../../models/user.model';
import { PhysiologicalData } from '../../models/physiological-data.model';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.page.html',
  styleUrls: ['./doctor-dashboard.page.scss'],
})
export class DoctorDashboardPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  patients: User[] = [];
  selectedPatientId: string | null = null;
  selectedPatientName: string = '';
  patientData: PhysiologicalData[] = [];
  isLoading = false;
  dataByType: Record<string, PhysiologicalData[]> = {};
  Object = Object; // Make Object available to the template

  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dataService: PhysiologicalDataService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadPatients();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadPatients() {
    this.userService.getPatients().subscribe({
      next: patients => {
        this.patients = patients;
      },
      error: err => {
        console.error('Error loading patients:', err);
        this.showAlert('Error', 'Failed to load patient list. Please try again.');
      }
    });
  }

  selectPatient(event: any) {
    const patientId = event.detail.value;
    this.selectedPatientId = patientId;

    const patient = this.patients.find(p => p._id === patientId);
    this.selectedPatientName = patient ? (patient.name || patient.email) : 'Unknown Patient';

    if (patientId) {
      this.loadPatientData(patientId);
    } else {
      this.patientData = [];
      this.dataByType = {};
    }
  }

  loadPatientData(patientId: string) {
    this.isLoading = true;
    this.dataService.getPatientData(patientId).subscribe({
      next: data => {
        this.patientData = data;
        this.groupDataByType();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading patient data:', err);
        this.isLoading = false;
        this.showAlert('Error', 'Failed to load patient data. Please try again.');
      }
    });
  }

  groupDataByType() {
    this.dataByType = {};

    for (const item of this.patientData) {
      if (!this.dataByType[item.dataType]) {
        this.dataByType[item.dataType] = [];
      }
      this.dataByType[item.dataType].push(item);
    }
  }

  logout() {
    this.authService.logout();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
