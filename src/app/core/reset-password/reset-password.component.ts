import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { EmailInputComponent } from '../../components/email-input/email-input.component';

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

  constructor(private router: Router) {}

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
    if(this.email.valid) {
      switch (this.state) {
        case "EnterEmail": {
          this.state = "Resend";
          break;
        }
      }
    }
  }

  gotoLogin() {
    this.router.navigate(['/login'])
  }

}
