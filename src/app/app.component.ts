import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SplashComponent } from './core/splash/splash.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SplashComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-base';
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.waitForAuthState().then(user => {
      if (user) {
        this.router.navigate(['/main']);
      } else {
        this.router.navigate(['/login']);
      }
      this.loading = false;
    });
  }

}
