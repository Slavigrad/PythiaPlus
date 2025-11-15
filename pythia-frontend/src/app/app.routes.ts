import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search/search-page.component';
import { EmployeeProfileComponent } from './features/employee/pages/employee-profile/employee-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchPageComponent },
  { path: 'employees/:id', component: EmployeeProfileComponent },
  { path: '**', redirectTo: '/search' }
];
