import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent implements OnInit {
  marginClass: string = '';
  @Input() maxWidth: string = '1200px';

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large
    ]).subscribe(result => {
      if (result.matches) {
        if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
          console.log('Small')
          this.marginClass = 'small-margin';
        } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
          console.log('Medium')
          this.marginClass = 'medium-margin';
        } else if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
          console.log('Large')
          this.marginClass = 'large-margin';
        }
      }
    });
  }

}
