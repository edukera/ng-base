import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

import { SplashComponent } from './core/splash/splash.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.waitForAuthState().then(user => {
      const currentUrl = this.router.url;
      if (!currentUrl.startsWith("/action")) {
        if (user) {
          this.router.navigate(['/main']);
        } else {
          this.router.navigate(['/login']);
        }
      }
      this.loading = false;
    });
  }

}
