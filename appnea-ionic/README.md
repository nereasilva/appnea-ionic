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

