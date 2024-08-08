import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { UserPreferencesService } from '../../../services/preferences.service';
import { Theme } from '../../../services/theme.service';
import { PreferenceData } from '../main.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

interface ThemeValue {
  value: Theme | "system";
  viewValue: string;
}

@Component({
  selector: 'preferences-dialog',
  templateUrl: 'preferences.component.html',
  styleUrl: './preferences.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatGridListModule,
    CommonModule,
    MatDividerModule,
    MatExpansionModule,
    DeleteAccountComponent,
  ],
})
export class PreferencesComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PreferencesComponent>);
  readonly data = inject<PreferenceData>(MAT_DIALOG_DATA);
  readonly panel = model(this.data.panel);
  readonly selectedTheme = model(this.data.prefs.theme)
  readonly selectedLang = model(this.data.prefs.lang)
  readonly selectedName = model(this.data.prefs.name)
  readonly email = model(this.data.prefs.email)

  private breakpointObserver = inject(BreakpointObserver);

  layoutchanges = this.breakpointObserver.observe([
    Breakpoints.Large,
    Breakpoints.Medium,
    Breakpoints.Small,
    Breakpoints.Handset
  ])

  onNoClick(): void {
    this.dialogRef.close();
  }

  possibleThemes: ThemeValue[] = [
    { value: 'light', viewValue: $localize`Light` },
    { value: 'dark', viewValue: $localize`Dark` },
    { value: 'system', viewValue: $localize`System` },
  ]

  constructor(
    private authService: AuthService,
    private prefService: UserPreferencesService,
    private langService: LanguageService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.authService.reloadUser();
    this.layoutchanges.subscribe(() =>
      this.breakpointChanged()
    );
  }

  breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Small)) {

    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {

    } else if (this.breakpointObserver.isMatched(Breakpoints.Large)) {

    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {

    }
  }

  onNameChange(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value.trim()
    if (this.prefService.prefs.name !== value) {
      this.selectedName.set(value)
      this.prefService.setPreferences({ ...this.prefService.prefs, name: value })
    }
  }

  /**
   * Note that setPreferences updates theme
   * @param event
   */
  onThemeChange(event: MatSelectChange) {
    this.selectedTheme.set(event.value)
    this.prefService.setPreferences({ ...this.prefService.prefs, theme: this.selectedTheme() })
    .catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    })
  }

  /**
   * Note that setPreferences updates lang
   * @param event
   */
  onLangChange(event: MatSelectChange) {
    const langNow = event.value
    const langBefore = this.prefService.prefs.lang
    this.selectedLang.set(langNow)
    this.prefService.setPreferences({ ...this.prefService.prefs, lang: langNow })
    .then(() => {
      const resolvedLangBefore = this.prefService.resolveLang(langBefore)
      const resolvedLangNow = this.prefService.resolveLang(langNow)
      if (resolvedLangNow !== resolvedLangBefore) {
        this.langService.setLang(resolvedLangNow)
      }
    })
    .catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    })
  }

  getDialogTitle() {
    switch (this.data.panel) {
      case "Account": return $localize `Account`
      case "Settings": return $localize `Settings`
      case "DeleteAccount": return $localize `Delete account - are you sure?`
    }
  }

  isAccount() { return this.data.panel === "Account" }
  isSettings() { return this.data.panel === "Settings" }
  isDeleteAccount() { return this.data.panel === "DeleteAccount" }

  close() {
    this.dialogRef.close();
  }

  isNameEditable() {
    return this.isProviderEmail()
  }

  isProviderEmail() {
    return "password" === this.authService.getDataProvider()
  }

  isEmailVerified() {
    return this.authService.isEmailVerified()
  }

  delete() {
    this.data.panel = "DeleteAccount"
  }

  sendVerif() {
    this.authService.sendVerificationEmail()
    .then(() => {
      this._snackBar.open($localize `Email sent.`, $localize`Dismiss`)
    })
    .catch(error => {
      this._snackBar.open(error.message, $localize`Dismiss`)
    })
  }

}