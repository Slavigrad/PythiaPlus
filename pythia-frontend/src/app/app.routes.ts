import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search/search-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchPageComponent },
  { path: '**', redirectTo: '/search' }
];
