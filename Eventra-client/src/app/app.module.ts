<<<<<<< HEAD
























// Social Login
=======
>>>>>>> frontend/feature/evet-category
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
// Social Login
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { AuthService } from './services/auth.service';
import { EventService } from './services/event.service';
import { OrganizerCartService } from './services/organizer-cart.service';

// Guards
import { AuthGuard } from './guards/guards/auth.guard';
import { RoleGuard } from './guards/guards/role.guard';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GoogleLoginButtonComponent  } from './components/google-login-button/google-login-button.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { OrganizerCartComponent } from './components/organizer-cart/organizer-cart.component';
import { CartComponent } from './components/cart/cart.component';
<<<<<<< HEAD
import { VenueComponent } from './venue/venue.component';

@NgModule({
  declarations: [AppComponent, OrganizerCartComponent, EventComponent, CategoryComponent, CartComponent, VenueComponent],
  imports: [BrowserModule,FormsModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
=======
import { EventCreateComponent} from './components/event-create/event-create.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventsListComponent } from './components/event-list/event-list.component';
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { CategoriesListComponent } from './components/category-list/category-list.component';
import { VenuesListComponent } from './components/venues-list/venues-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    MapComponent,
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    GoogleLoginButtonComponent ,
    ErrorMessageComponent,
    SpinnerComponent,
    CartComponent,
    OrganizerCartComponent,
    EventCreateComponent,
    EventDetailsComponent,
    EventEditComponent,
    EventsListComponent,
    CategoryCreateComponent,
    CategoryEditComponent,
    CategoriesListComponent,
    VenuesListComponent
  
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginModule,

    // Material Modules
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule
  ],
  providers: [
    AuthService,
    EventService,
    OrganizerCartService,
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '50990553909-n1krvis5mpprq9l5amija61h4v04roej.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
>>>>>>> frontend/feature/evet-category
})
export class AppModule { }
