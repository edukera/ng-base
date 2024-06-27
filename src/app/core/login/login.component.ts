import { Component, OnInit, effect, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import {FormsModule} from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'login-form',
  standalone: true,
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
  imports: [
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatSidenavModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ]
})
class LoginFormComponent {
  isLight: boolean;

  constructor(public authService: AuthService, private router: Router, private themeService: ThemeService) {
    this.isLight = true
    effect(() => {
      var currentTheme = this.themeService.getTheme()()
      if (currentTheme == 'system') {
        currentTheme = this.themeService.getDefaultTheme()
      }
      this.isLight = currentTheme === 'light'
    })
  }

  signInWithGoogle() {
    this.authService.googleSignIn().then(res => {
      console.log('Logged in successfully', res);
      this.router.navigate(['/main'])
    }).catch(err => {
      console.error('Login failed', err);
    });
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    LoginFormComponent,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
  ]
})
export class LoginComponent implements OnInit {
  leftSpan = 6
  rightSpan = 3

  private breakpointObserver = inject(BreakpointObserver);

  layoutchanges = this.breakpointObserver.observe([
    Breakpoints.Large,
    Breakpoints.Medium,
    Breakpoints.Small,
    Breakpoints.Handset
  ])

  ngOnInit(): void {
    this.layoutchanges.subscribe(() =>
      this.breakpointChanged()
    );
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.leftSpan = 6
      this.rightSpan = 3
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.leftSpan = 5
      this.rightSpan = 4
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.leftSpan = 0
      this.rightSpan = 9
    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.leftSpan = 0
      this.rightSpan = 9
    }
  }

}


