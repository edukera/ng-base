import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { EmailInputComponent } from '../../../components/email-input/email-input.component';
import { PasswordFeedbackComponent } from '../../../components/password-feedback/password-feedback.component';
import { StrongPwdRegExp } from '../../../components/password-feedback/password-feedback.component';
import { PasswordInputComponent } from '../../../components/password-input/password-input.component';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { ThemeService } from '../../../services/theme.service';
import { ngbaseConfig } from '../../ngbase.config';

type LoginFormState =
  "Login1"     // enter email + go to register button
| "Login2"     // enter pwd
| "Register1"  // enter email + go to connexion button
| "Register2"  // enter pwd with pwd check process

@Component({
  selector: 'login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  imports: [
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatSidenavModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    EmailInputComponent,
    PasswordInputComponent,
    PasswordFeedbackComponent,
    MatProgressSpinnerModule
  ]
})
export class LoginFormComponent {
  state : LoginFormState = "Login1"
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly pwd = new FormControl('', []);
  isLight: boolean;
  showSpinner: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private langService: LanguageService,
    private _snackBar: MatSnackBar
  ) {
    this.isLight = true
    this.showSpinner = false
    effect(() => {
      var currentTheme = this.themeService.theme
      this.isLight = currentTheme === 'light'
    })
  }

  getTitle() {
    switch (this.state) {
      case "Login1": return $localize`Welcome back`;
      case "Login2": return $localize`Enter your password`;
      case "Register1": case "Register2": return $localize`Create your account`
    }
  }

  showDesc() : boolean {
    switch (this.state) {
      case "Register1": case "Register2": return true;
      default: return false
    }
  }

  getDesc() {
    switch (this.state) {
      case "Register1": return ($localize`Sign in to` +  ' ' + ngbaseConfig.appName)
      case "Register2": return ($localize`Define password to access` + ' ' +  ngbaseConfig.appName)
      default: return "NA"
    }
  }

  showModify() : boolean {
    switch (this.state) {
      case "Login1": case "Register1": return false;
      default: return true
    }
  }

  showForgot() : boolean {
    switch (this.state) {
      case "Login2": return true;
      default: return false
    }
  }

  modifyEmail(state: string) {
    return () => {
      switch (state as LoginFormState) {
        case "Login2": {
          this.state = "Login1"
          break;
        }
        case "Register2": {
          this.state = "Register1";
          break;
        }
      }
    }
  }

  showPwd() : boolean {
    switch (this.state) {
      case "Login1": case "Register1": return false;
      default: return true
    }
  }

  showPwdFeedback() : boolean {
    if (this.pwd.dirty) {
      switch (this.state) {
        case "Register2": return true;
        default: return false
      }
    } else {
      return false
    }
  }

  toSignIn() {
    this.state = "Register1"
  }

  toConnect() {
    this.state = "Login1"
  }

  private assertValidity() : asserts this is { email: FormControl<string>, pwd: FormControl<string> } {
    if (!this.email.valid || this.email.value === null) {
      throw new Error($localize`Invalid Email.`)
    }
    if (!this.pwd.valid || this.pwd.value === null) {
      throw new Error($localize`Invalid Password.`)
    }
  }

  continue() {
    switch (this.state) {
      case "Login1": {
        if (this.email.valid)
          this.state = "Login2";
        break;
      }
      case "Login2": {
        this.showSpinner = true
        try {
          this.assertValidity()
          this.authService.pwdSignIn(this.email.value, this.pwd.value).then(res => {
            this.router.navigate(['/main'])
          }).catch((err: any) => {
            this.showSpinner = false
            if (err.code === "auth/invalid-credential") {
              this.pwd.setErrors({ invalidAuth: true })
            } else {
              console.error(err)
              this._snackBar.open(err.message, $localize`Dismiss`)
            }
          });
        } catch(e) {
          this.showSpinner = false
          console.error(e)
        }
        break;
      }
      case "Register1": {
        if (this.email.valid)
          this.state = "Register2";
        break;
      }
      case "Register2": {
        this.showSpinner = true
        try {
          this.assertValidity()
          if (StrongPwdRegExp.isValid(this.pwd.value)) {
            this.authService.createUserWithPwd(this.email.value, this.pwd.value).then(() => {
              this.authService.sendVerificationEmail().then(() => {
                this.showSpinner = false
                this.router.navigate(['/verify-email'])
              })
              .catch((err: Error) => {
                this._snackBar.open(err.message, $localize`Dismiss`);
              })
            })
            .catch((err: Error) => {
              this._snackBar.open(err.message, $localize`Dismiss`);
            })
          } else {
            throw new Error($localize`Password does not follow rules.`)
          }
        } catch(e) {
          console.error(e)
        }
        this.showSpinner = false
        break
      }
    }
  }

  showSignIn() : boolean {
    switch (this.state) {
      case "Login1": case "Login2": return true;
      default: return false
    }
  }

  showConnect() : boolean {
    switch (this.state) {
      case "Register1": case "Register2": return true;
      default: return false
    }
  }

  signInWithGoogle() {
    this.authService.googleSignIn().then(res => {
      console.log('Logged in successfully', res);
      this.router.navigate(['/main'])
    }).catch(err => {
      this._snackBar.open(err.message, $localize`Dismiss`);
    });
  }

  gotoReset() {
    this.router.navigate(['/reset-password'])
  }

}
