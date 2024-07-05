import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmEmailComponent } from './core/confirm-email/confirm-email.component';
import { LoginComponent } from './core/login/login.component';
import { MainComponent } from './core/main/main.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { SplashComponent } from './core/splash/splash.component';
import { AuthGuard } from './guards/auth.guard';
import { mainRoutes } from './pages/pages.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: mainRoutes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
