import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule, MatSelectChange} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ThemeService, Theme } from '../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';

interface ThemeValue {
  value: Theme | 'system';
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  possibleThemes: ThemeValue[] = [
    { value: 'light', viewValue: 'Light' },
    { value: 'dark', viewValue: 'Dark' },
    { value: 'system', viewValue: 'System' },
  ]

  constructor(public authService: AuthService, private router: Router, private themeService: ThemeService) {}

  onSelectionChange(event: MatSelectChange) {
    console.log('Selected value:', event.value);
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

  signOut() {
    this.authService.signOut().then(() => {
      console.log('Signed out successfully');
      this.router.navigate(['/login'])
    }).catch(err => {
      console.error('Sign out failed', err);
    });
  }
}
