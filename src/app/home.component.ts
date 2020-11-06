import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})

export class HomeComponent{
	constructor(private route: ActivatedRoute, private router: Router){}

	goToProfile(){
		this.router.navigate(['profile', 9], {
			relativeTo: this.route,
			queryParams: {
				showContacts: true
			}
		})
	}
}