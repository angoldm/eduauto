import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstructorstblComponent } from './instructorstbl.component';

const routes: Routes = [{ path: '', component: InstructorstblComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorstblRoutingModule { }
