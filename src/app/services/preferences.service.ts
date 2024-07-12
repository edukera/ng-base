// src/app/services/user-preferences.service.ts
import { inject, Injectable } from '@angular/core';
import { doc, docData, DocumentData, DocumentReference, Firestore, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './auth.service';
// Un service d'authentification que vous auriez défini pour gérer l'auth
import { Theme, ThemeService } from './theme.service';
import { LanguageService, SupportedLang } from './language.service';

export interface UserPreferences {
  name  : string;
  email : string;
  theme : Theme         | 'system'
  lang  : SupportedLang | 'system'
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private firestore = inject(Firestore);
  private _prefs: UserPreferences = { name: '', email: '', theme: 'system', lang: 'system' };
  private docRef : DocumentReference<DocumentData, DocumentData> | null = null
  private prefSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private langService: LanguageService
  ) {
    this.init()
  }

  private resolveTheme(theme: Theme | 'system') : Theme {
    switch(theme) {
      case 'system': return this.themeService.defaultTheme;
      default: return theme
    }
  }

  private init() {
    this.authService.user$.subscribe(user => {
      if (user !== null) {
        this._prefs = { ...this._prefs, email: user.email ?? 'NA', name: user.displayName ?? '' }
        this.docRef = doc(this.firestore, 'user_preferences/' + user.uid);
        const prefObservable = docData(this.docRef) as Observable<UserPreferences>
        this.prefSubscription = prefObservable.subscribe({
          next : (prefs) => {
            if (prefs === undefined) {
              this.setPreferences(this._prefs)
            } else {
              this._prefs = prefs;
              this.themeService.setTheme(this.resolveTheme(prefs.theme))
            }
          },
          error: (err) => {
            console.error(err)
          }
        })
      }
    })
  }

  public get prefs() { return this._prefs }

  public setPreferences(preferences: UserPreferences) {
    if (this.docRef !== null) {
      return setDoc(this.docRef, preferences)
    }
    throw new Error("No doc.")
  }

  public deletePrefs() {
    if (this.docRef && this.prefSubscription) {
      this.prefSubscription.unsubscribe();
      return deleteDoc(this.docRef)
    }
    throw new Error("Null document")
  }

}
