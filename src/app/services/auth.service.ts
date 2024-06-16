import { Injectable, inject } from '@angular/core';
import { User, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { skip } from 'rxjs/operators';

import { Auth, GoogleAuthProvider, signInWithPopup, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private auth = inject(Auth);

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.next(user);
    });
  }

  async waitForAuthState(): Promise<User | null> {
    return await firstValueFrom(this.currentUser.pipe(
      skip(1) // Skip the initial emission
    ));
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then(result => {
        this.currentUser.next(result.user);
        return result;
      });
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.currentUser.next(null);
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }
}
