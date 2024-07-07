import { CommonModule } from '@angular/common';
import { Component, OnInit, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ThemeService } from '../../services/theme.service';
import { UserPreferencesService } from '../../services/preferences.service';

type Action = "verifyEmail"

@Component({
  selector: 'verify',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ]
})
export class ActionComponent implements OnInit {
  action: Action = "verifyEmail"
  name = model("")

  isVerifyEmail() : boolean {
    return this.action === "verifyEmail"
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private prefService: UserPreferencesService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const oobCode = params['oobCode'];
      if (mode && oobCode) {
        if (mode === 'verifyEmail') {
          this.action = "verifyEmail"
          this.verifyEmail(oobCode);
        }
      }
    });
  }

  verifyEmail(oobCode: string) {
    this.authService.applyCode(oobCode).then(() => {
      console.log('Email verified.');
    }).catch(error => {
      this._snackBar.open(error.message, "Dismiss")
    });
  }

  accept() {
    this.router.navigate(['/main']);
  }

  onNameChange(event: FocusEvent) {
    const value = (event.target as HTMLInputElement).value.trim()
    if (value !== "" && this.prefService.preferences.name !== value) {
      this.prefService.setPreferences({ ...this.prefService.preferences, name: value })
    }
  }

}