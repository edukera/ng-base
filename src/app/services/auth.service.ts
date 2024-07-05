import { Injectable, inject } from '@angular/core';
import { User, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { skip } from 'rxjs/operators';

import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from '@angular/fire/auth';

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

  pwdSignIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
    .then((result) => {
      // Signed in
      this.currentUser.next(result.user);
      const user = this.currentUser.getValue()
      if (user !== null)
        sendEmailVerification(user)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  createUserWithPwd(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
    .then((result) => {
      // Signed up
      this.currentUser.next(result.user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
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
