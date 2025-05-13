# APPNEA - Sleep Apnea Monitoring Application

APPNEA is a digital health application for remote monitoring of patients diagnosed with sleep apnea. It facilitates the analysis of sleep data by medical professionals to improve diagnosis and define treatment.

## Features

- **User Authentication**: Secure login and registration system with role-based access (Patient/Doctor)
- **Data Visualization**: Interactive graphs showing physiological data (heart rate, SpO2, snoring)
- **Doctor-Patient Chat**: Real-time messaging between doctors and patients
- **Chatbot Assistant**: AI-powered chatbot providing information about sleep apnea
- **Role-Based Dashboards**: Separate interfaces for patients and doctors

## Technology Stack

- **Frontend**: Ionic Framework with Angular
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Real-time Communication**: Socket.io

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Angular CLI
- Ionic CLI

## Installation

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Rename `.env.example` to `.env` if it exists
   - The default configuration uses MongoDB at `mongodb://127.0.0.1:27017/appnea`

4. Start the server (includes database migration):
   ```
   npm run dev
   ```

   Alternatively, you can use the provided batch script on Windows:
   ```
   start-server.bat
   ```

   Note: You can also run just the migration separately if needed:
   ```
   npm run migrate
   ```

### Frontend Setup

1. Navigate to the root directory:
   ```
   cd ..
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install the Ionic CLI:
   ```
   npm install @ionic/cli
   ```

3. Start the Ionic application:
   ```
   ionic serve
   ```

## Usage

1. Open your browser and navigate to `http://localhost:8100`
2. Log in with one of the test accounts:
   - Patient: paciente@test.com / paciente123 (Name: "paciente de prueba")
   - Doctor: doctor@test.com / doctor123 (Name: "doctor de prueba")
3. Explore the dashboard based on your role

## Patient Features

- View your physiological data in interactive graphs
- View pre-populated sample data
- Chat with your doctors
- Get information from the APPNEA Assistant chatbot

## Doctor Features

- View a list of all patients
- Select a patient to view their physiological data
- Chat directly with patients

## Running on Android with Android Studio

### Prerequisites

- Android Studio
- JDK 17
- Android SDK (API level 34)
- Android device or emulator

### Quick Start

1.  **Ensure project dependencies are installed**:
    If you haven't done so already, or if dependencies have changed, open a terminal in the project root directory (`appnea-ionic/appnea-ionic`) and run:
    ```bash
    npm install
    ```

2.  **Start the backend and frontend servers**:
    - In a separate terminal, run the provided script from the project root:
      ```bash
      .\start-app.bat
      ```
    - This starts both the backend (listening on `http://localhost:3000`) and the Ionic frontend development server (serving at `http://localhost:8100`). Ensure both servers are running before proceeding.

3.  **Build the Ionic application for production**:
    In another terminal, navigate to the project root directory and run:
    ```bash
    ionic build
    ```
    This command compiles the webapp.

4.  **Sync web assets with the Android project**:
    Run the following Capacitor command to copy the webapp to the native Android project and update plugins:
    ```bash
    npx cap sync android
    ```

5.  **Open the Android project in Android Studio**:
    To open the native Android project, run:
    ```bash
    npx cap open android
    ```
    This command will launch Android Studio and open the `android` subfolder.

6.  **Run the app in Android Studio**:
    - Once Android Studio has opened and synced the project:
    - Select the "app" module in the run/debug configurations (it's usually selected by default).
    - Click the "Run 'app'" button (the green triangle icon).
    - Choose your connected Android device or a configured Android Virtual Device (Emulator).

7.  **Login with test accounts**:
    Once the app is running on your device/emulator:
    - Patient: `paciente@test.com` / `paciente123`
    - Doctor: `doctor@test.com` / `doctor123`
    - (These are the same credentials as for the web/desktop version)

### How It Works

The application uses a platform detection system that automatically configures the correct API URL:

- When running in a web browser, it uses `localhost:3000` for the API
- When running in Android Studio, it automatically uses `10.0.2.2:3000` (Android's special IP for localhost)

This means you can run both platforms simultaneously without changing any configuration files.
