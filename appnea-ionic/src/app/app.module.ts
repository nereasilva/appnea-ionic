import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Auth
import { AuthInterceptor } from './auth/auth.interceptor';

// Components
import { ChatComponent } from './components/chat/chat.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { SimpleGraphComponent } from './components/simple-graph/simple-graph.component';

// Pages
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { RoleSelectionPage } from './pages/role-selection/role-selection.page';
import { PatientDashboardPage } from './pages/patient-dashboard/patient-dashboard.page';
import { DoctorDashboardPage } from './pages/doctor-dashboard/doctor-dashboard.page';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatbotComponent,
    SimpleGraphComponent,
    LoginPage,
    RegisterPage,
    RoleSelectionPage,
    PatientDashboardPage,
    DoctorDashboardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
