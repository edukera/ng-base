import { Component, inject, model, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import { UserPreferencesService } from '../../../services/preferences.service';
import { Theme, ThemeService } from '../../../services/theme.service';
import { PreferenceData } from '../main.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

interface ThemeValue {
  value: Theme;
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
    DeleteAccountComponent
  ],
})
export class PreferencesComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PreferencesComponent>);
  readonly data = inject<PreferenceData>(MAT_DIALOG_DATA);
  readonly panel = model(this.data.panel);
  readonly prefs   = model(this.data.prefs)
  readonly selectedTheme = model(this.data.prefs.theme)
  readonly selectedLang = model(this.data.prefs.lang)

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
    private themeService: ThemeService,
    private prefService: UserPreferencesService
  ) {

  }

  ngOnInit(): void {
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
    if (this.prefService.preferences.name !== value) {
      this.prefService.setPreferences({ ...this.prefs(), name: value })
    }
  }

  onThemeChange(event: MatSelectChange) {
    this.selectedTheme.set(event.value)
    this.prefService.setPreferences({ ...this.prefs(), theme: this.selectedTheme() })
    switch (event.value as Theme) {
      case 'system': {
        break
      }
      default: {
        const theme : Theme = event.value
        this.themeService.setTheme(theme)
      }
    }
  }

  onLangChange(event: MatSelectChange) {
    this.selectedLang.set(event.value)
    this.prefService.setPreferences({ ...this.prefs(), lang: this.selectedLang() }, () => {
      if (this.selectedLang() === 'fr') {
        window.location.href = '/fr';
      } else if (this.selectedLang() === 'en') {
        window.location.href = '/en';
      }
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

  getThemeIcon(theme : Theme) : string {
    switch (theme) {
      case 'dark': return "dark_mode";
      case 'light': return "light_mode";
      case 'system': return "contrast"
    }
  }

  getSelectedThemeIcon() {
    return this.getThemeIcon(this.selectedTheme())
  }

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

}