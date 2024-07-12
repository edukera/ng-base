import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { ngbaseConfig } from '../../ngbase.config';

@Component({
  selector: 'tagline',
  standalone: true,
  templateUrl: './tagline.component.html',
  styleUrl: './tagline.component.scss',
  imports: [
    MatDrawerContainer
  ]
})
export class TaglineComponent implements AfterViewInit, OnDestroy {
  dataText = [
    ngbaseConfig.appName,
    $localize `The best place to start an Angular/Firebase project.`
  ];
  caretHidden = [ true, true ]
  timeouts: any[] = [];

  clearTimeouts() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts = [];
  }

  ngAfterViewInit() {
    const timeoutId = setTimeout(() => {
      this.startTextAnimation(0);
    }, 0)
    this.timeouts.push(timeoutId);
  }

  ngOnDestroy() {
    this.clearTimeouts()
  }

  typeWriter(textId: number, charId: number, fnCallback: () => void) {
    const text = this.dataText[textId]
    // check if text isn't finished yet
    const elementId = textId % this.dataText.length
    if (charId === 0) {
      if (textId === 0) {
        for(var i = 0; i < this.dataText.length; i++) {
          const el = document.querySelector("#typewriter" + (i + 1));
          if (el) {
            el.innerHTML = '';
          }
        }
      }
      this.caretHidden[elementId] = false
    }
    if (charId < text.length) {
      const el = document.querySelector("#typewriter" + (elementId + 1));
      if (el) {
        el.innerHTML = text.substring(0, charId + 1);
      }

      // wait for a while and call this function again for next character
      const timeoutId = setTimeout(() => {
        this.typeWriter(textId, charId + 1, fnCallback);
      }, 100);
      this.timeouts.push(timeoutId);
    } else if (typeof fnCallback === 'function') {
      if (textId !== this.dataText.length - 1)
        this.caretHidden[elementId] = true
      // text finished, call callback if there is a callback function
      const timeoutId = setTimeout(fnCallback, 700);
      this.timeouts.push(timeoutId);
    }
  }

  startTextAnimation(i: number) {
    if (typeof this.dataText[i] === 'undefined') {
      const timeoutId = setTimeout(() => {
        this.startTextAnimation(0);
      }, 20000);
      this.timeouts.push(timeoutId);
    } else if (i < this.dataText.length) {
      // text exists! start typewriter animation
      this.typeWriter(i, 0, () => {
        // after callback (and whole text has been animated), start next text
        this.startTextAnimation(i + 1);
      });
    }
  }
}
