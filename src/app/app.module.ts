import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildOneComponent } from './_components/children/child-one/child-one.component';
import { ChildTwoComponent } from './_components/children/child-two/child-two.component';
import { HostComponent } from './_components/host/host.component';

@NgModule({
  declarations: [
    AppComponent,HostComponent,ChildOneComponent,
    ChildTwoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
