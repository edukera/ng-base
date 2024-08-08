import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { mainRoutes } from '../../pages/pages.routes';
import { AuthService } from '../../services/auth.service';
import { UserPreferences, UserPreferencesService } from '../../services/preferences.service';
import { ThemeService } from '../../services/theme.service';
import { ngbaseConfig } from '../ngbase.config';
import { PreferencesComponent } from './preferences/preferences.component';

export type PreferencePanel = "Account" | "Settings" | "DeleteAccount"
type DialogWidth = "auto" | "450px"

export interface PreferenceData {
  panel: PreferencePanel;
  prefs: UserPreferences
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
  rootRoutes = mainRoutes.filter(r=>r.path && r.path !== 'profile')
  appName = ngbaseConfig.appName
  isMinimized = false;
  showMinimizer = true;
  readonly dialog = inject(MatDialog);
  readonly profilePanel = model("Account");
  dialogWidth: DialogWidth = 'auto'


  private breakpointObserver = inject(BreakpointObserver);
  layoutchanges = this.breakpointObserver.observe([
    Breakpoints.Large,
    Breakpoints.Medium,
    Breakpoints.Small,
    Breakpoints.Handset
  ])

  toggleSidenavWidth() {
    this.isMinimized = !this.isMinimized;
  }

  constructor(
    private router: Router,
    public authService: AuthService,
    private prefsService : UserPreferencesService,
    private themeService : ThemeService
  ) {}

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map(result => {
        this.isMinimized = false
        this.showMinimizer = false
        const breakpoints = result.breakpoints
        if (breakpoints[Breakpoints.Small] || breakpoints[Breakpoints.XSmall]) {
          this.dialogWidth = 'auto'
          return true
        } else {
          this.dialogWidth= '450px'
          this.showMinimizer = true
          return false
        }
      }),
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

  openProfileDialog(panel: PreferencePanel): void {
    this.profilePanel.set(panel)
    const dialogRef = this.dialog.open(PreferencesComponent, {
      width: this.dialogWidth,
      data: { panel: this.profilePanel(), prefs: this.prefsService.prefs },
    });
  }

  getTheme() {
    return this.themeService.theme
  }

}
