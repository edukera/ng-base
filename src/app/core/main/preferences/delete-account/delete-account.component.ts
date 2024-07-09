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
    $localize `Deleting your account is permanent and cannot be undone.`,
    $localize `Deletion will prevent you from accessing ng-base application.`,
    $localize `You data will be deleted.`,
    $localize `Read our help center article for more information.`
  ]

  email: FormControl = new FormControl('', []);
  deletectrl: FormControl = new FormControl('', []);

  constructor(
    private authservice: AuthService,
    private prefService: UserPreferencesService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}

  getEmail() {
    return this.prefService.preferences.email
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
    return email === this.prefService.preferences.email && deletectrl === "DELETE"
  }

  deleteAccount() {
    this.prefService.deletePrefs().then(() => {
      this.authservice.deleteUser().then(() => {
        console.log("Account deleted.")
        if(this.dialogRef) {
          this.dialogRef.close()
        }
        this.router.navigate(['/login'])
      }).catch(error => {
        this._snackBar.open(error.message, "Dismiss")
      })
    }).catch(error => {
      this._snackBar.open(error.message, "Dismiss")
    })
  }
}