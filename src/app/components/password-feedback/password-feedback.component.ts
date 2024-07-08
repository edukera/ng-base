import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

// https://medium.com/@ojiofor/angular-reactive-forms-strong-password-validation-8dbcce92eb6c
type PwdCheckRule = "atLeast12Chars" | "atLeast1Special" | "atLeast1Digit"

export class StrongPwdRegExp {
  static atLeast12Chars:  RegExp = /.{12,}/
  static atLeast1Special: RegExp = /[^a-zA-Z0-9]/
  static atLeast1Digit:   RegExp = /(.*[0-9].*)/
  static isValid(value: string) : boolean {
    return (
      this.atLeast12Chars.test(value)  &&
      this.atLeast1Special.test(value) &&
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

@Component({
  selector: 'password-feedback',
  templateUrl: './password-feedback.component.html',
  styleUrls: ['./password-feedback.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatSidenavModule
  ]
})
export class PasswordFeedbackComponent {
  @Input() pwd: FormControl = new FormControl('', [Validators.required]);
  @Input() pwd2: FormControl | null = null;

  getPwdCheckItemClass(rule: PwdCheckRule) {
    return {
      'item': true,
      'check-item': StrongPwdRegExp.testRule(this.pwd?.value ?? "", rule)
    }
  }

  getSamePwdClass() {
    return {
      'item': true,
      'check-item': this.isSame()
    }
  }

  checkSamePwd() : boolean {
    return this.pwd2 !== null
  }

  private isSame() : boolean {
    if (this.pwd2 !== null) {
      return this.pwd.value === this.pwd2.value
    } else {
      return false
    }
  }
}