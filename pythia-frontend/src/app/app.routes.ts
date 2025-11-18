import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search/search-page.component';
import { EmployeeProfileComponent } from './features/employee/pages/employee-profile/employee-profile.component';
import { EmployeeListComponent } from './features/employee/pages/employee-list/employee-list.component';
import { MasterDataComponent } from './pages/master-data/master-data.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'master-data', component: MasterDataComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/:id', component: EmployeeProfileComponent },
  { path: '**', redirectTo: '/dashboard' }
];
