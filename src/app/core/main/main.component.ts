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
import { PreferencesComponent } from './preferences/preferences.component';

export interface DialogData {
  panelId: number;
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
    const dialogRef = this.dialog.open(PreferencesComponent, {
      data: { panelId: this.profilePanel(), prefs: this.prefsService.preferences },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
