import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    title: 'Dashboard'
  },
  {
    path: 'blank',
    loadComponent: () =>
      import('./blank/blank.component').then(
        (c) => c.BlankComponent
      ),
    title: 'Blank'
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
  }
];
