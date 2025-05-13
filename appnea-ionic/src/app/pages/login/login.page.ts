import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'circles'
    });
    await loading.present();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        loading.dismiss();
        this.error = null;
      },
      error: _error => {
        this.isLoading = false;
        loading.dismiss();
        this.error = "Either the email address, the password or both are wrong";
        this.showAlert('Login failed', "Either the email address, the password or both are wrong");
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

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
