import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { NotFoundComponent }   from './not-found.component';
import { ProfileComponent } from './profile.component';
import { TimetableComponent } from './timetable/timetable.component';
//import { InstructorComponent } from './instructor/instructor.component';
//import { InstructorstblComponent } from './instructorstbl/instructorstbl.component';
//import { InstructorsComponent } from './instructors/instructors.component';
//import { ExampletblComponent } from './exampletbl/exampletbl.component';
//import { LoginComponent } from './auth/login.component';

const routes: Routes = [
    {
		path: '', component: HomeComponent, pathMatch: 'full'
		, children: [
		]
	},
	{ path: 'profile', component: ProfileComponent },
	//{ path: 'instructors', component: InstructorstblComponent },
	{ path: 'instructors', loadChildren: () => import('./instructorstbl/instructorstbl.module').then(m => m.InstructorstblModule) },
	//{ path: 'instrlist', component: InstructorsComponent },
	//{ path: 'exampletbl', component: ExampletblComponent },
	//{ path: 'instructor/:id', component: InstructorComponent },
	{ path: 'instructor/:id', loadChildren: () => import('./instructor/instructor.module').then(m => m.InstructorModule) },
	{ path: 'profile/:id', component: ProfileComponent, data: {
		breadcrumbs: 'Профиль'
		}},
    //{ path: 'login', component: LoginComponent },
    //{ path: 'login', redirectTo: 'https://app108060.1capp.net/Avtoshkola/hs/City/GetCity', pathMatch: 'full' },
    { path: 'contacts', redirectTo: '/', pathMatch: 'full' },
	{ path: 'timetable', component: TimetableComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
  ],
  imports: [
	  RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', initialNavigation: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
