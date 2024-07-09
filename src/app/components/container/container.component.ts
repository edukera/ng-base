import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'ng-base-container',
  standalone: true,
  imports: [CommonModule, MatGridListModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class NgContainerComponent implements OnInit {
  paddingClass = "large-padding"

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

  breakpointChanged() {
    if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.paddingClass = "small-padding"
    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.paddingClass = "medium-padding"
    } else if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.paddingClass = "large-padding"
    } else if(this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.paddingClass = "handset-padding"
    }
  }

}
