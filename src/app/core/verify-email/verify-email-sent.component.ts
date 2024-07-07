import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { NgContainerComponent } from '../../components/container/container.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'verify-email-sent',
  standalone: true,
  imports: [
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule
  ],
  templateUrl: './verify-email-sent.component.html',
  styleUrl: './verify-email-sent.component.scss'
})
export class VerifyEmailSentComponent {
  constructor(private authService: AuthService) {}

  getEmail() {
    return this.authService.getEmail()
  }

  sendEmail() {
    return this.authService.sendVerificationEmail()
  }

}