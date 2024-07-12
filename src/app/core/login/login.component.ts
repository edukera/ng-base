import { Component, OnInit, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TaglineComponent } from './tagline/tagline.component';
import { NgContainerContentComponent } from '../../components/container-content/container-content.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    MatGridListModule,
    LoginFormComponent,
    TaglineComponent,
    NgContainerContentComponent,
    CommonModule
  ]
})
export class LoginComponent implements OnInit {
  readonly cols = 9
  leftSpan = 6
  rightSpan = 3
  isHandset = false

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
      this.isHandset = false
    } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.leftSpan = 5
      this.rightSpan = 4
      this.isHandset = false
    } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.leftSpan = 0
      this.rightSpan = 9
      this.isHandset = true
    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.leftSpan = 0
      this.rightSpan = 9
      this.isHandset = true
    }
  }

}


