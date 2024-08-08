import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// Importer CommonModule
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ngbaseConfig } from '../../core/ngbase.config';
import { Theme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'ng-base-container-content',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatDividerModule,
    MatSidenavModule
  ],
  templateUrl: './container-content.component.html',
  styleUrl: './container-content.component.scss'
})
export class NgContainerContentComponent {
  readonly termsLink: string = ngbaseConfig.termsLink
  readonly privacyLink: string = ngbaseConfig.privacyLink

  constructor(private themeService: ThemeService) {}

  getTheme() : Theme { return this.themeService.theme }

}
