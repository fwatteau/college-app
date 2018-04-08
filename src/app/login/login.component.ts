import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validator/email';

@Component({
  selector: 'login',
  styles: [``],
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public showSpinner: boolean;

  constructor(
    public route: Router,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
  ) {
  }

  public ngOnInit() {
      this.loginForm = this.formBuilder.group({
          email: ['',
              Validators.compose([Validators.required, EmailValidator.isValid])],
          password: ['',
              Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  public loginUser(): void {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.showSpinner = true;
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then( () => {
            this.route.navigate(['/home'], {queryParams: {newUser: this.loginForm.value.email}});
        }, (error) => {
          this.showSpinner = false;
          console.log(error);
          window.alert(error.message);
        });
    }
  }

  public signup(): void {
    this.authProvider.signupUser(this.loginForm.value.email,
          this.loginForm.value.password)
        .then(() => {
          this.route.navigate(['/home'], {queryParams: {newUser: this.loginForm.value.email}});
        });
  }
/*
    goToResetPassword(): void {
        this.navCtrl.push('reset-password');
    }*/
}
