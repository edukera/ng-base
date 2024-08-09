import { CommonModule } from '@angular/common';
import { Component, model, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { PasswordFeedbackComponent } from '../../components/password-feedback/password-feedback.component';
import { StrongPwdRegExp } from '../../components/password-feedback/password-feedback.component';
import { PasswordInputComponent } from '../../components/password-input/password-input.component';
import { AuthService } from '../../services/auth.service';
import { UserPreferencesService } from '../../services/preferences.service';
import { ngbaseConfig } from '../ngbase.config';

type Action =
  "verifyEmail"
| "resetPassword"
| "confirmResetPwd"

@Component({
  selector: 'verify',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    PasswordInputComponent,
    PasswordFeedbackComponent,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ActionComponent implements OnInit {
  action: Action  = "verifyEmail"
  oobCode: string = ""
  name = model("")
  readonly pwd1 = new FormControl('', []);
  readonly pwd2 = new FormControl('', []);
  readonly termsLink: string = ngbaseConfig.termsLink
  readonly privacyLink: string = ngbaseConfig.privacyLink
  showSpinner = signal(false)

  isVerifyEmail() : boolean {
    return this.action === "verifyEmail"
  }

  isResetPassword() : boolean {
    return this.action === "resetPassword"
  }

  isConfirmResetPwd() : boolean {
    return this.action === "confirmResetPwd"
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private prefService: UserPreferencesService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.oobCode = params['oobCode'];
      if (mode && this.oobCode !== "") {
        if (mode === 'verifyEmail') {
          this.action = mode
          this.applyCode(this.oobCode);
        } else if (mode === 'resetPassword') {
          this.action = mode
        }
      }
    });
  }

  applyCode(oobCode: string) {
    this.authService.applyCode(oobCode).then(() => {
      console.log('Email verified.');
    }).catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    });
  }

  accept() {
    this.router.navigate(['/login']);
  }

  onNameChange(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value.trim()
    if (value !== "" && this.prefService.prefs.name !== value) {
      this.prefService.setPreferences({ ...this.prefService.prefs, name: value })
    }
  }

  async resetPwd() {
    if (
      this.pwd1.value !== null &&
      this.pwd1.value === this.pwd2.value &&
      StrongPwdRegExp.isValid(this.pwd1.value)
    ) {
      this.showSpinner.set(true)
      try {
        await this.authService.confirmPwdReset(this.oobCode, this.pwd1.value)
        this.action = "confirmResetPwd"
      } catch(error: any) {
        this.showSpinner.set(false)
        this._snackBar.open(error.message, $localize`Dismiss`)
        return
      }
      this.showSpinner.set(false)
    }
  }

  gotoLogin() {
    this.router.navigate(['/login'])
  }

  showPwdFeedback() : boolean {
    return this.pwd1.dirty
  }

}