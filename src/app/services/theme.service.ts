import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');
  private defaultTheme : Theme = 'light'

  private _document = inject(DOCUMENT);

  constructor() {
    this.detectColorScheme()
    effect(() => {
      const theme = this.theme() === 'system' ? this.defaultTheme : this.theme()
      if (theme === 'dark') {
        this._document.documentElement.classList.add('dark');
      } else {
        this._document.documentElement.classList.remove('dark');
      }
    });
  }

  detectColorScheme() {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      this.defaultTheme = 'dark'
    } else {
      this.defaultTheme = 'light'
    }
    this.theme.set(this.defaultTheme)

    //darkThemeMq.addEventListener('change', (e) => {
    //  if (e.matches) {
    //    this.theme.set('dark')
    //  } else {
    //    this.theme.set('light')
    //  }
    //});
  }

  setTheme(theme: Theme) {
    this.theme.update(() => {
      return theme;
    });
  }
}
