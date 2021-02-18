import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {AuthenticationService} from '../auth/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss']
})

export class LoginComponent{

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
    ){
    //this.route.data.subscribe(data => console.log(data));
  }
  loginForm: FormGroup;
  data:any;
  error = '';
  loading = false;

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  login(): void {
    this.loading = true;
    this.authenticationService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).pipe(first())
    .subscribe(
        data => {
            this.data = data;
        },
        error => {
            this.error = error;
            this.loading = false;
        });
  }
}
