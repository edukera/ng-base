import { effect, Injectable, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export type SupportedLang = "en" | "fr"

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private supportedLangs: SupportedLang[] = ['en', 'fr'];

  /**
   * used to resolve System lang preferences
   */
  private defaultLang : SupportedLang = 'en'

  constructor(private router: Router, private route: ActivatedRoute) {
    var browserLang = navigator.language.split('-')[0] as SupportedLang;
    browserLang = this.isSupported(browserLang) ? browserLang : 'en';
    this.defaultLang = browserLang
    /**
     * Do not redirect to default lang here, because it would indefinitely loop.
     * Default lang detection is done in ng-base/index.html (see utils directory)
     * which redirects to project/fr/ or project/en/ based on default lang
     */
  }

  private isSupported(lang: string) : boolean {
    return this.supportedLangs.includes(lang as SupportedLang)
  }

  setLang(lang: SupportedLang) {
    localStorage.setItem('appLang', lang);
    window.location.href = '/' + lang
  }

  get browserLang() { return this.defaultLang }

}