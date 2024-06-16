import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');

  private _document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      if (this.theme() === 'dark') {
        this._document.documentElement.classList.add('dark');
      } else {
        this._document.documentElement.classList.remove('dark');
      }
    });
  }

  toggleTheme(theme: Theme) {
    this.theme.update((value) => {
      return theme;
    });
  }
}
