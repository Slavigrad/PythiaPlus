import { Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { EmployeeListComponent } from './features/employee/pages/employee-list/employee-list.component';
import { EmployeeProfileComponent } from './features/employee/pages/employee-profile/employee-profile.component';
import { SearchPageComponent } from './pages/search/search-page.component';
import { MasterDataComponent } from './pages/master-data/master-data.component';
import { ProjectsPageComponent } from './features/projects/pages/projects-page/projects-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/:id', component: EmployeeProfileComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'master-data', component: MasterDataComponent },
  { path: '**', redirectTo: '/search' }
];
