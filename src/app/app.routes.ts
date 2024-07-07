import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionComponent } from './core/action/action.component';
import { LoginComponent } from './core/login/login.component';
import { MainComponent } from './core/main/main.component';
import { ResetPasswordComponent } from './core/reset-password/reset-password.component';
import { SplashComponent } from './core/splash/splash.component';
import { VerifyEmailSentComponent } from './core/verify-email/verify-email-sent.component';
import { AuthGuard } from './guards/auth.guard';
import { mainRoutes } from './pages/pages.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'verify-email', component: VerifyEmailSentComponent },
  { path: 'action', component: ActionComponent },
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
