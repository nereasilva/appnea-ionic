import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PhysiologicalDataService } from '../../services/physiological-data.service';
import { User } from '../../models/user.model';
import { PhysiologicalData } from '../../models/physiological-data.model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.page.html',
  styleUrls: ['./patient-dashboard.page.scss'],
})
export class PatientDashboardPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  physiologicalData: PhysiologicalData[] = [];
  doctors: User[] = [];
  selectedDoctorId: string | null = null;
  selectedDoctorName: string = '';
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
        this.loadData();
        this.loadDoctors();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadData() {
    this.isLoading = true;
    this.dataService.getMyData().subscribe({
      next: data => {
        this.physiologicalData = data;
        this.groupDataByType();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.showAlert('Error', 'Failed to load your health data. Please try again.');
      }
    });
  }

  loadDoctors() {
    this.userService.getDoctors().subscribe({
      next: doctors => {
        this.doctors = doctors;
      },
      error: err => {
        console.error('Error loading doctors:', err);
      }
    });
  }

  groupDataByType() {
    this.dataByType = {};

    for (const item of this.physiologicalData) {
      if (!this.dataByType[item.dataType]) {
        this.dataByType[item.dataType] = [];
      }
      this.dataByType[item.dataType].push(item);
    }
  }

  selectDoctor(event: any) {
    const doctorId = event.detail.value;
    this.selectedDoctorId = doctorId;

    const doctor = this.doctors.find(d => d._id === doctorId);
    this.selectedDoctorName = doctor ? (doctor.name || doctor.email) : 'Unknown Doctor';
  }

  generateMockData() {
    this.isLoading = true;
    this.dataService.generateMockData().subscribe({
      next: data => {
        this.physiologicalData = data;
        this.groupDataByType();
        this.isLoading = false;
        this.showAlert('Success', 'Mock data generated successfully.');
      },
      error: err => {
        console.error('Error generating mock data:', err);
        this.isLoading = false;
        this.showAlert('Error', 'Failed to generate mock data. Please try again.');
      }
    });
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
