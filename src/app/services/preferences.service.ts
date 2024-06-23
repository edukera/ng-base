// src/app/services/user-preferences.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, DocumentReference, setDoc, DocumentData } from '@angular/fire/firestore';
import { AuthService } from './auth.service'; // Un service d'authentification que vous auriez défini pour gérer l'auth
import { Theme, ThemeService } from './theme.service';
import { Observable } from 'rxjs';

type Lang = 'fr' | 'en' | 'system'

export interface UserPreferences {
  name: string;
  email: string;
  theme: Theme | 'system'
  lang: Lang
}

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private firestore = inject(Firestore);
  private _prefs: UserPreferences = { name: 'NA', email: 'NA', theme: 'system', lang: 'system' };
  private docRef : DocumentReference<DocumentData, DocumentData> | null = null

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {
    this.init()
  }

  private init() {
    this.authService.user$.subscribe(user => {
      console.log(user)
      if (user !== null) {
        this._prefs = { ...this._prefs, email: user.email ?? 'NA', name: user.displayName ?? 'NA' }
        this.docRef = doc(this.firestore, 'user_preferences/' + user.uid);
        const prefObservable = docData(this.docRef) as Observable<UserPreferences>
        prefObservable.subscribe({
          next : (prefs) => {
            if (prefs === undefined) {
              this.setPreferences(this._prefs)
            } else {
              console.log(prefs);
              this._prefs = prefs;
              this.themeService.setTheme(this._prefs.theme)
            }
          },
          error: (err) => {
            console.error(err)
          }
        })
      }
    })
  }

  public get preferences() { return this._prefs }

  public setPreferences(preferences: UserPreferences) {
    if (this.docRef !== null) {
      setDoc(this.docRef, preferences).then(() => {
        console.log("pref written")
      })
    } else {
      console.error('no doc ref!')
    }
  }

}
