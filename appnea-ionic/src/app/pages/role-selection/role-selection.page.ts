import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
})
export class RoleSelectionPage implements OnInit {
  selectedRole: 'Patient' | 'Doctor' | null = null;
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user already has a role
    this.authService.user.subscribe(user => {
      this.currentUser = user;

      // If user already has a role, redirect to appropriate dashboard
      if (user && user.role) {
        setTimeout(() => {
          if (user.role === 'Patient') {
            this.router.navigate(['/patient-dashboard'], { replaceUrl: true });
          } else if (user.role === 'Doctor') {
            this.router.navigate(['/doctor-dashboard'], { replaceUrl: true });
          }
        }, 100);
      }
    });
  }

  selectRole(role: 'Patient' | 'Doctor') {
    this.selectedRole = role;
  }

  async confirmRole() {
    if (!this.selectedRole) {
      this.showAlert('Selection Required', 'Please select a role to continue.');
      return;
    }

    // Check if user already has a role
    if (this.currentUser && this.currentUser.role) {
      this.showAlert(
        'Role Already Set',
        `You already have the ${this.currentUser.role} role assigned. Please contact support if you need to change your role.`
      );
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Setting role...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.setRole(this.selectedRole).subscribe({
      next: () => {
        this.isLoading = false;
        loading.dismiss();
      },
      error: errorMessage => {
        this.isLoading = false;
        loading.dismiss();
        this.showAlert('Error', errorMessage);
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
  }
}
