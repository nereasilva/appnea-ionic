import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { RoleSelectionPage } from './pages/role-selection/role-selection.page';
import { PatientDashboardPage } from './pages/patient-dashboard/patient-dashboard.page';
import { DoctorDashboardPage } from './pages/doctor-dashboard/doctor-dashboard.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'role-selection',
    component: RoleSelectionPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'patient-dashboard',
    component: PatientDashboardPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Patient' }
  },
  {
    path: 'doctor-dashboard',
    component: DoctorDashboardPage,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Doctor' }
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
