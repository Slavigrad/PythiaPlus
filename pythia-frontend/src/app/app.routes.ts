export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/:id', component: EmployeeProfileComponent },
  { path: 'master-data', component: MasterDataComponent },
  { path: '**', redirectTo: '/dashboard' }
];
