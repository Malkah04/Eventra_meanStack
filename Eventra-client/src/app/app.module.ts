import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizerCartComponent } from './components/organizer-cart/organizer-cart.component';
import { HttpClientModule } from '@angular/common/http';
import { EventComponent } from './components/event/event.component';
import { CategoryComponent } from './components/category/category.component';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [AppComponent, OrganizerCartComponent, EventComponent, CategoryComponent, CartComponent],
  imports: [BrowserModule,FormsModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
