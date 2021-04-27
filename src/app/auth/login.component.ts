import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {AuthenticationService} from '../auth/authentication.service';
import { first } from 'rxjs/operators';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss']
})

export class LoginComponent{
  currentUser: User;
  isAuth: boolean;
  hidepwd = true;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
    ){
    //this.route.data.subscribe(data => console.log(data));
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user
      this.isAuth = this.isAuthenticated();
    });
  }
  loginForm: FormGroup;
  logoutForm: FormGroup;
  data:any;
  error = '';
  loading = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.logoutForm = this.fb.group({
    });
  }

  login(): void {
    this.loading = true;
    this.authenticationService.login(this.loginForm.get('username').value, this.loginForm.get('password').value).pipe(first())
    .subscribe(
        data => {
            this.data = data;
            this.currentUser.username = data.username;
            //location.reload();
        },
        error => {
            this.error = error;
            this.loading = false;
        });
        //this.loginForm.reset();
        /*this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([this.router.url]);
        });*/
  }
  logout(): void {
    this.authenticationService.logout()
    location.reload()
  }

  isAuthenticated(){
    //return (this.currentUser != undefined && this.currentUser != null && this.currentUser.username != "")
    return this.authenticationService.isAuthenticated()
  }
}
