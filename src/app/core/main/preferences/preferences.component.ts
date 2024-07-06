import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../../services/auth.service';
import { UserPreferencesService } from '../../../services/preferences.service';
import { Theme, ThemeService } from '../../../services/theme.service';

import { DialogData } from '../main.component';

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
    MatGridListModule
  ],
})
export class PreferencesComponent {
  readonly dialogRef = inject(MatDialogRef<PreferencesComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly panelId = model(this.data.panelId);
  readonly prefs   = model(this.data.prefs)
  readonly selectedTheme = model(this.data.prefs.theme)
  readonly selectedLang = model(this.data.prefs.lang)

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
  ) {}

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

}