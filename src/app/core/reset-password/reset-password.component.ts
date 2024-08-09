import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { EmailInputComponent } from '../../components/email-input/email-input.component';
import { AuthService } from '../../services/auth.service';

type ResetState =
  "EnterEmail" // first panel to enter email and click continue
| "Resend"     // second panel with resent reset email button

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    EmailInputComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  state : ResetState = "EnterEmail"
  showSpinner = signal(false)

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  checkEmailPhrase = $localize`Please check your e-mail address ${this.email.value} to know how to reset your password.`

  constructor(private router: Router, private authService: AuthService, private _snackBar: MatSnackBar) {}

  showEnterEmail() : boolean {
    switch (this.state) {
      case "EnterEmail": return true;
      default: return false
    }
  }

  showResend() : boolean {
    switch (this.state) {
      case "Resend": return true;
      default: return false
    }
  }

  async continue() {
    if(this.email.value !== null && this.email.valid) {
      switch (this.state) {
        case "EnterEmail": {
          await this._send(this.email.value)
          break;
        }
      }
    }
  }

  private async _send(email: string) {
    this.showSpinner.set(true)
    try {
      await this.authService.sendPwdRestEmail(email)
      this.state = "Resend";
    }
    catch(error: any) {
      this.showSpinner.set(false)
      this._snackBar.open(error.message, $localize`Dismiss`)
      return
    }
    this.showSpinner.set(false)
    this._snackBar.open($localize`Email sent.`, $localize`Dismiss`)
  }

  resend() {
    if(this.email.value !== null && this.email.valid) {
      this._send(this.email.value)
    }
  }

  gotoLogin() {
    this.router.navigate(['/login'])
  }

}
