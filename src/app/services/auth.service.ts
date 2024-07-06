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
  sendPasswordResetEmail,
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
      })
      .catch((error) => {
        console.error(error)
        throw error
      });
  }

  pwdSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((result) => {
      console.log('Logged in successfully', result);
      this.currentUser.next(result.user);
      return result
    })
    .catch((error) => {
      throw error
    });
  }

  createUserWithPwd(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
    .then((result) => {
      // Signed up
      this.currentUser.next(result.user)
      console.log("Account created")
      return result
    })
    .catch((error) => {
      //const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorMessage)
      throw error
      // ..
    });
  }

  sendVerificationEmail() {
    const user = this.currentUser.getValue()
    if (user !== null) {
      return sendEmailVerification(user).then(() => {
        console.log("Verification email sent")
      }).catch((error) => {
        console.error(error)
        throw error
      });
    }
    throw new Error("Cannot send verification email: null user")
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.currentUser.next(null);
    });
  }

  sendResetPwdEmail(email: string) {
    sendPasswordResetEmail(this.auth, email, )
  }

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }
}
