import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { EmailInputComponent } from '../../components/email-input/email-input.component';
import { AuthService } from '../../services/auth.service';

type ResetState =
  "EnterEmail" // first panel to enter email and click continue
| "Resend"     // seconde panel with resent reset email button

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
    EmailInputComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  state : ResetState = "EnterEmail"

  readonly email = new FormControl('', [Validators.required, Validators.email]);

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

  continue() {
    if(this.email.value !== null && this.email.valid) {
      switch (this.state) {
        case "EnterEmail": {
          this._send(this.email.value)
          break;
        }
      }
    }
  }

  private _send(email: string) {
    this.authService.sendPwdRestEmail(email).then(() => {
      this.state = "Resend";
    })
    .catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    })
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
