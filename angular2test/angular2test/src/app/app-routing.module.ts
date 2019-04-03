import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ImageComponent} from "./image/image.component";

const routes: Routes = [
  {path: '', component: ImageComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
