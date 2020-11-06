    import {Component} from '@angular/core';
    import {ActivatedRoute} from '@angular/router';
    
    @Component({
      selector: 'app-profile',
      templateUrl: './profile.component.html',
	  styleUrls: ['./app-nav.component.scss']
    })
    export class ProfileComponent{
      constructor(private route: ActivatedRoute){
        this.route.data.subscribe(data => console.log(data));
      }
    }