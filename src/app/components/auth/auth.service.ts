import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB81U2aRbxrXv04gASLDc5AN8u2c-OX0QM',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError), tap(resData => {
          this.handleLogin(
            resData.email, 
            resData.localId, 
            resData.idToken, 
            +resData.expiresIn 
            )
        })
      );
    }
  

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB81U2aRbxrXv04gASLDc5AN8u2c-OX0QM',
    {
      email: email,
      password: password,
      returnSecureToken: true,
    }
    ).pipe(
        catchError(this.handleError), tap(resData => {
          this.handleLogin(
            resData.email, 
            resData.localId, 
            resData.idToken, 
            +resData.expiresIn 
            )
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMsg);
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMsg = 'This E-Mail already exists';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMsg = 'This E-Mail does not exist';
          break;
        case 'INVALID_PASSWORD':
          errorMsg = 'Invalid Password';
          break;
      }
      return throwError(errorMsg);
  }

  private handleLogin(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn + 1000);
      const user = new User(
        email, 
        userId, 
        token, 
        expirationDate
        );
      this.user.next(user);
  }
}
