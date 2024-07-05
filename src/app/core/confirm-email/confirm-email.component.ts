import { Component } from '@angular/core';
import { NgContainerComponent } from '../../components/container/container.component';
import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'confirm-email',
  standalone: true,
  imports: [
    NgContainerComponent,
    NgContainerContentComponent,
    MatSidenavModule,
    MatButtonModule
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {

}