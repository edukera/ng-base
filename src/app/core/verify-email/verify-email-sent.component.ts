import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'verify-email-sent',
  standalone: true,
  imports: [
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './verify-email-sent.component.html',
  styleUrl: './verify-email-sent.component.scss'
})
export class VerifyEmailSentComponent {
  showSpinner = signal(false)
  constructor(private authService: AuthService, private _snackBar : MatSnackBar) {}

  getEmail() {
    return this.authService.getEmail()
  }

  async sendEmail() {
    this.showSpinner.set(true)
    try {
      await this.authService.sendVerificationEmail()

    } catch (error: any) {
      this.showSpinner.set(false)
      this._snackBar.open(error.message, $localize`Dismiss`)
      return
    }
    this.showSpinner.set(false)
    this._snackBar.open($localize`Email sent.`, $localize`Dismiss`);
  }

}