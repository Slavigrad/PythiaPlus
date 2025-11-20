import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { EmployeeListComponent } from './features/employee/pages/employee-list/employee-list.component';
import { EmployeeProfileComponent } from './features/employee/pages/employee-profile/employee-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/:id', component: EmployeeProfileComponent },
  { path: '**', redirectTo: '/dashboard' }
];
