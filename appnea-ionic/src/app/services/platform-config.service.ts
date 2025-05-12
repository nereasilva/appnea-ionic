import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformConfigService {
  constructor(private platform: Platform) {
    this.configurePlatformSpecificSettings();
  }

  private configurePlatformSpecificSettings() {
    // Wait for the platform to be ready
    this.platform.ready().then(() => {
      // Check if we're running on Android
      if (this.platform.is('android') || this.platform.is('capacitor')) {
        console.log('Running on Android - using 10.0.2.2 for API URL');
        // Use the Android emulator special IP to access host machine
        environment.apiUrl = 'http://10.0.2.2:3000/api';
      } else {
        console.log('Running on browser - using localhost for API URL');
        // Use localhost for browser access
        environment.apiUrl = 'http://localhost:3000/api';
      }
      
      console.log('Platform configuration complete. API URL:', environment.apiUrl);
    });
  }
}
