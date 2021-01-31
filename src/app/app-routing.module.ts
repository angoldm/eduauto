import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { NotFoundComponent }   from './not-found.component';
import { ProfileComponent } from './profile.component';
import { InstructorComponent } from './instructor/instructor.component';
import { InstructorstblComponent } from './instructorstbl/instructorstbl.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { ExampletblComponent } from './exampletbl/exampletbl.component';
import { LoginComponent } from './auth/login.component';

const routes: Routes = [
    {
		path: '', component: HomeComponent, pathMatch: 'full'
		, children: [
		]
	},
	{ path: 'profile', component: ProfileComponent },
	{ path: 'instructors', component: InstructorstblComponent },
	{ path: 'instrlist', component: InstructorsComponent },
	{ path: 'instructor/:id', component: InstructorComponent },
	{ path: 'profile/:id', component: ProfileComponent, data: {
		breadcrumbs: 'Профиль'
		}},
    //{ path: 'login', component: LoginComponent },
    //{ path: 'login', redirectTo: 'https://app108060.1capp.net/Avtoshkola/hs/City/GetCity', pathMatch: 'full' },
    { path: 'contacts', redirectTo: '/', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
	HomeComponent,
    ProfileComponent,
	NotFoundComponent
  ],
  imports: [
	  RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
