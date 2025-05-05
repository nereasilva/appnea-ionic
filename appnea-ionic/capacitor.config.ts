import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appnea-ionic',
  webDir: 'dist/app',
  server: {
    // This allows the app to connect to your local development server
    url: 'http://10.0.2.2:8100',
    cleartext: true
  }
};

export default config;
