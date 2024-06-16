import { Route } from '@angular/router';

type RouteWithIcon = Route & { icon: string }

export const mainRoutes: RouteWithIcon[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
    icon: ''
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    title: 'Dashboard',
    icon: 'dashboard'
  },
  {
    path: 'blank',
    loadComponent: () =>
      import('./blank/blank.component').then(
        (c) => c.BlankComponent
      ),
    title: 'Blank',
    icon: 'check_box_outline_blank'
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(
        (c) => c.ProfileComponent
      ),
    icon: ''
  }
];
