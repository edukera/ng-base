import { inject, Injectable } from '@angular/core';
import { applyActionCode, Auth, confirmPasswordReset, createUserWithEmailAndPassword, deleteUser, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { httpsCallable } from '@angular/fire/functions';
import { Functions, HttpsCallableResult } from '@angular/fire/functions';
import { AuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private auth = inject(Auth);
  private functions = inject(Functions)

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

  private signInWithAuthProvider(provider: AuthProvider) {
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

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return this.signInWithAuthProvider(provider)
  }

  microsoftSignIn() {
    const provider = new OAuthProvider('microsoft.com')
    return this.signInWithAuthProvider(provider)
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

  async sendVerificationEmail(): Promise<HttpsCallableResult<unknown>> {
    const user = this.currentUser.getValue()
    if (user?.email) {
      const callable = httpsCallable(this.functions, 'sendVerificationEmail');
      try {
        return callable({ });
      } catch (error: any) {
        console.error(error)
        throw new Error("Cannot send verification email", error.msg)
      }
    } else {
      throw new Error("Cannot send verification email: null user")
    }
  }

  sendPwdRestEmail(email: string) {
    const callable = httpsCallable(this.functions, 'sendPasswordResetEmail');
    try {
      return callable({ email: email });
    } catch (error: any) {
      console.error(error)
      throw new Error("Cannot send verification email", error.msg)
    }
  }

  confirmPwdReset(code: string, pwd: string) {
    return confirmPasswordReset(this.auth, code, pwd)
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.currentUser.next(null);
    });
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

  deleteUser() {
    const user = this.currentUser.getValue()
    if (user !== null) {
      return deleteUser(user)
    }
    throw new Error("Null user")
  }

  public reloadUser() {
    const user = this.auth.currentUser;
    if (user) {
      return user.reload()
    }
    throw new Error("No user.")
  }

}
