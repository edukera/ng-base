import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

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

}
