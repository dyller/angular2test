import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ImageComponent } from './image/image.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {environment} from "../environments/environment.prod";

import {ImageCropperComponent, ImageCropperModule} from 'ngx-image-cropper';

import {AngularFirestoreModule} from '@angular/fire/firestore';
import { MomentModule } from 'angular2-moment';
import {AngularFireStorageModule} from "@angular/fire/storage";
import {FileService} from "./shared/file.service";
import {MessageService} from "./shared/message.service";

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    MomentModule,
    AppRoutingModule,
    AngularFireStorageModule,
    ImageCropperModule
  ],
  providers: [
    FileService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
