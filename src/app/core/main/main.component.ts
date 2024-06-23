import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule, MatSelectChange} from '@angular/material/select';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

import { ThemeService, Theme } from '../../services/theme.service';
import { mainRoutes } from '../../pages/pages.routes';
import { AuthService } from '../../services/auth.service';
import {MatTabsModule} from '@angular/material/tabs';
import { UserPreferences, UserPreferencesService } from '../../services/preferences.service';

export interface DialogData {
  panelId: number;
  prefs: UserPreferences
}

interface ThemeValue {
  value: Theme | 'system';
  viewValue: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ]
})
export class MainComponent {
  rootRoutes = mainRoutes.filter(r=>r.path && r.path !== 'profile');
  private breakpointObserver = inject(BreakpointObserver);
  isMinimized = false;
  readonly dialog = inject(MatDialog);
  readonly profilePanel = model(0);


  toggleSidenavWidth() {
    this.isMinimized = !this.isMinimized;
  }

  constructor(
    private router: Router,
    public authService: AuthService,
    private prefsService : UserPreferencesService
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayProfile() {
    this.router.navigate(['main/profile'])
  }

  signOut() {
    this.authService.signOut().then(() => {
      console.log('Signed out successfully');
      this.router.navigate(['/login'])
    }).catch(err => {
      console.error('Sign out failed', err);
    });
  }

  openProfileDialog(panelId: number): void {
    this.profilePanel.set(panelId)
    const dialogRef = this.dialog.open(ProfileDialog, {
      data: { panelId: this.profilePanel(), prefs: this.prefsService.preferences },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'profile-dialog',
  templateUrl: 'profile-dialog.html',
  styleUrl: './profile-dialog.scss',
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
export class ProfileDialog {
  readonly dialogRef = inject(MatDialogRef<ProfileDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly panelId = model(this.data.panelId);
  readonly prefs   = model(this.data.prefs)
  readonly selectedTheme = model(this.data.prefs.theme)
  readonly selectedLang = model(this.data.prefs.lang)

  onNoClick(): void {
    this.dialogRef.close();
  }

  possibleThemes: ThemeValue[] = [
    { value: 'light', viewValue: 'Light' },
    { value: 'dark', viewValue: 'Dark' },
    { value: 'system', viewValue: 'System' },
  ]

  constructor(
    private themeService: ThemeService,
    private prefService: UserPreferencesService
  ) {}

  onThemeChange(event: MatSelectChange) {
    this.selectedTheme.set(event.value)
    this.prefService.setPreferences({ ...this.prefs(), theme: this.selectedTheme() })
    switch (event.value as (Theme | 'system')) {
      case 'system': {
        break
      }
      default: {
        const theme : Theme = event.value
        this.themeService.toggleTheme(theme)
      }
    }
  }

  onLangChange(event: MatSelectChange) {
    this.selectedLang.set(event.value)
    this.prefService.setPreferences({ ...this.prefs(), lang: this.selectedLang() })
  }

  getThemeIcon(theme : Theme | 'system') : string {
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

}