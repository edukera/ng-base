import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export type SupportedLang = "en" | "fr"

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private supportedLangs: SupportedLang[] = ['en', 'fr'];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.switchToLang(this.detectBrowserLang())
  }

  private isSupported(lang: string) : boolean {
    return this.supportedLangs.includes(lang as SupportedLang)
  }

  private detectBrowserLang() : SupportedLang {
    var browserLang = navigator.language.split('-')[0] as SupportedLang;
    browserLang = this.isSupported(browserLang) ? browserLang : 'en';
    console.log(browserLang)
    return browserLang
  }

  switchToLang(lang: SupportedLang) {
    const url = this.router.url;
    const prefix = url.split('/')[1]
    // switch only if prefix is already 'fr' or 'en', that is we are not local
    if (this.isSupported(prefix) && lang !== prefix) {
      window.location.href = '/' + lang
    }
  }

}