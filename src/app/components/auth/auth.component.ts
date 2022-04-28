import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  loginMode = true;
  isLoading = false;
  error: String = null;

  constructor(private authService: AuthService,
			private router: Router) {}

  onSwitchPage() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

	let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.loginMode) {
		authObs = this.authService.login(email, password);
	  } else {
		authObs = this.authService.signUp(email, password);
	  }
	  
    authObs.subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
		    this.router.navigate(['/recipes']);
        },
        errorMsg => {
          console.log(errorMsg);
          this.error = errorMsg;
          this.isLoading = false;
        }
      );

    form.reset();
  }
}
