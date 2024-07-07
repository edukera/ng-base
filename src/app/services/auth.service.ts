import { inject, Injectable } from '@angular/core';
import { applyActionCode, Auth, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

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

  getDataProvider() : string | null {
    const user = this.currentUser.getValue()
    if (user !== null) {
      if (user.providerData.length > 0) {
        return user.providerData[0].providerId
      } else {
        return null
      }
    } else {
      return null
    }
  }

  isEmailVerified() : boolean {
    const user = this.currentUser.getValue()
    if (user !== null) {
      return user.emailVerified
    }
    else return false
  }

  applyCode(code: string) {
    return applyActionCode(this.auth, code)
  }

  getEmail() : string | null {
    const user = this.currentUser.getValue()
    if (user !== null) {
      return user.email
    }
    return null
  }

}
