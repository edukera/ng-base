import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TaglineComponent } from './tagline/tagline.component';
import { MatIconModule } from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

// https://medium.com/@ojiofor/angular-reactive-forms-strong-password-validation-8dbcce92eb6c
type PwdCheckRule = "atLeast12Chars" | "atLeast1Special" | "atLeast1Digit"

class StrongPwdRegExp {
  static atLeast12Chars:  RegExp = /.{12,}/
  static atLeast1Special: RegExp = /[^a-zA-Z0-9]/
  static atLeast1Digit:   RegExp = /(.*[0-9].*)/
  static isValid(value: string) : boolean {
    return (
      this.atLeast12Chars.test(value) &&
      this.atLeast1Special.test(value)   &&
      this.atLeast1Digit.test(value)
    )
  }
  static testRule(value: string, rule: PwdCheckRule) : boolean {
    switch (rule) {
      case "atLeast12Chars": {
        return this.atLeast12Chars.test(value)
      }
      case "atLeast1Digit": {
        return this.atLeast1Digit.test(value)
      }
      case "atLeast1Special": {
        return this.atLeast1Special.test(value)
      }
    }
  }
}

type LoginFormStatus = "Login1" | "Login2" | "Register1" | "Register2"

@Component({
  selector: 'login-form',
  standalone: true,
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  imports: [
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatSidenavModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ]
})
class LoginFormComponent {
  isLight: boolean;
  hidePwd: boolean = true;
  status : LoginFormStatus = "Login1"
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly pwd = new FormControl('', []);
  errorEmailMessage = signal('');
  errorPwdMessage = signal('')

  constructor(public authService: AuthService, private router: Router, private themeService: ThemeService) {
    this.isLight = true
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
    effect(() => {
      var currentTheme = this.themeService.getTheme()()
      if (currentTheme == 'system') {
        currentTheme = this.themeService.getDefaultTheme()
      }
      this.isLight = currentTheme === 'light'
    })
  }

  getTitle() {
    switch (this.status) {
      case "Login1": return "Welcome back";
      case "Login2": return "Enter your password";
      case "Register1": case "Register2": return "Create your account"
    }
  }

  showDesc() : boolean {
    switch (this.status) {
      case "Register1": case "Register2": return true;
      default: return false
    }
  }

  getDesc() {
    switch (this.status) {
      case "Register1": return "Sign in to ng-base"
      case "Register2": return "Define password to access ng-base"
      default: return "NA"
    }
  }

  showModify() : boolean {
    switch (this.status) {
      case "Login1": case "Register1": return false;
      default: return true
    }
  }

  showForgot() : boolean {
    switch (this.status) {
      case "Login2": return true;
      default: return false
    }
  }

  modifyEmail() {
    switch (this.status) {
      case "Login2": {
        this.status = "Login1"
        break;
      }
      case "Register2": {
        this.status = "Register1"
      }
    }
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorEmailMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorEmailMessage.set('Not a valid email');
    } else {
      this.errorEmailMessage.set('');
    }
  }

  showPwd() : boolean {
    switch (this.status) {
      case "Login1": case "Register1": return false;
      default: return true
    }
  }

  showPwdFeedback() : boolean {
    if (this.pwd.dirty) {
      switch (this.status) {
        case "Register2": return true;
        default: return false
      }
    } else {
      return false
    }
  }

  switchVisibility() {
    this.hidePwd = !this.hidePwd
  }

  toSignIn() {
    this.status = "Register1"
  }

  toConnect() {
    this.status = "Login1"
  }

  continue() {
    switch (this.status) {
      case "Login1": {
        if (this.email.valid)
          this.status = "Login2";
        break;
      }
      case "Register1": {
        if (this.email.valid)
          this.status = "Register2";
        break;
      }
      case "Register2": {
        if (StrongPwdRegExp.isValid(this.pwd?.value || '')) {
          console.log("Password OK")
        };
        break
      }
      default: {
        // do nothing
      }
    }
  }

  showSignIn() : boolean {
    switch (this.status) {
      case "Login1": case "Login2": return true;
      default: return false
    }
  }

  showConnect() : boolean {
    switch (this.status) {
      case "Register1": case "Register2": return true;
      default: return false
    }
  }

  signInWithGoogle() {
    this.authService.googleSignIn().then(res => {
      console.log('Logged in successfully', res);
      this.router.navigate(['/main'])
    }).catch(err => {
      console.error('Login failed', err);
    });
  }

  getPwdCheckItemClass(rule: PwdCheckRule) {
    return {
      'item': true,
      'dark-item': !this.isLight,
      'check-item': StrongPwdRegExp.testRule(this.pwd?.value ?? "", rule)
    }
  }

}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    LoginFormComponent,
    TaglineComponent,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
  ]
})
export class LoginComponent implements OnInit {
  leftSpan = 6
  rightSpan = 3

  private breakpointObserver = inject(BreakpointObserver);

  layoutchanges = this.breakpointObserver.observe([
    Breakpoints.Large,
    Breakpoints.Medium,
    Breakpoints.Small,
    Breakpoints.Handset
  ])

  ngOnInit(): void {
    this.layoutchanges.subscribe(() =>
      this.breakpointChanged()
    );
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.leftSpan = 6
      this.rightSpan = 3
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.leftSpan = 5
      this.rightSpan = 4
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.leftSpan = 0
      this.rightSpan = 9
    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.leftSpan = 0
      this.rightSpan = 9
    }
  }

}


