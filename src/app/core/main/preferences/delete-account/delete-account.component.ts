import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../services/auth.service';
import { UserPreferencesService } from '../../../../services/preferences.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import { PreferencesComponent } from '../preferences.component';

@Component({
  selector: 'delete-account',
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class DeleteAccountComponent {
  @Input() dialogRef : MatDialogRef<PreferencesComponent> | null = null

  warnings: string[] = [
    $localize`Deleting your account is permanent and cannot be undone.`,
    $localize`Deletion will prevent you from accessing the application.`,
    $localize`Your data will be deleted.`,
    $localize`Read our help center article for more information.`
  ]

  deleteKeyword: string = $localize`DELETE`
  deletePhrase: string= $localize`To proceed, type ${this.deleteKeyword} in the input field below.`

  email: FormControl = new FormControl('', []);
  deletectrl: FormControl = new FormControl('', []);

  constructor(
    private authservice: AuthService,
    private prefService: UserPreferencesService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  getEmail() {
    return '(' + $localize`type in '` + this.prefService.prefs.email + `')`
  }

  getButtonClass() {
    return {
      'form-element': true,
      'delete': this.isEnabled()
    }
  }

  isEnabled() : boolean {
    const email = this.email.value
    const deletectrl = this.deletectrl.value
    return email === this.prefService.prefs.email && deletectrl === this.deleteKeyword
  }

  deleteAccount() {
    this.prefService.deletePrefs().then(() => {
      this.authservice.deleteUser().then(() => {
        if(this.dialogRef) {
          this.dialogRef.close()
        }
        this.router.navigate(['/login'])
        this._snackBar.open($localize`Account deleted.`, $localize`Dismiss`)
      }).catch(error => {
        this._snackBar.open(error.message, $localize`Dismiss`)
      })
    }).catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    })
  }
}