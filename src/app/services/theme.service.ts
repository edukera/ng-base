import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = signal<Theme>('light');
  private _defaultTheme : Theme = 'light'

  private _document = inject(DOCUMENT);

  constructor() {
    this.detectColorScheme()
    effect(() => {
      if (this._theme() === 'dark') {
        this._document.documentElement.classList.add('dark');
      } else {
        this._document.documentElement.classList.remove('dark');
      }
    });
  }

  detectColorScheme() {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      this._defaultTheme = 'dark'
    } else {
      this._defaultTheme = 'light'
    }
    this._theme.set(this.defaultTheme)
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
  }

  get theme() {
    return this._theme();
  }

  get defaultTheme() {
    return this._defaultTheme
  }
}
