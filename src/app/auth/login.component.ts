import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../app.component.scss']
})

export class LoginComponent{

  loginForm: FormGroup;
  constructor(private fb: FormBuilder){
    //this.route.data.subscribe(data => console.log(data));
  }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        login: ['', Validators.required],
        password: ['']
      });
  }

  login(): void {

  }
}