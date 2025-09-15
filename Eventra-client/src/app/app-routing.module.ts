import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/guards/auth.guard';
import { RoleGuard } from './guards/guards/role.guard';

// Auth Components
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


//Event Components
import { EventCreateComponent} from './components/event-create/event-create.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventsListComponent } from './components/event-list/event-list.component';

// Venue Components
import { VenueCreateComponent} from './components/venue-create/venue-create.component';
import { VenueEditComponent } from './components/venue-edit/venue-edit.component';
import { VenueListComponent } from './components/venue-list/venue-list.component';
import { VenueDetailsComponent } from './components/venue-details/venue-details.component';


//Category Components
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { CategoriesListComponent } from './components/category-list/category-list.component';
// App Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
const routes: Routes = [
  // Default: go to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  // Event routes
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/edit/:id', component: EventEditComponent },
  { path: 'events', component: EventsListComponent },
  { path: 'events/:id', component: EventDetailsComponent },

  // Venue routes
  { path: 'venues/create', component: VenueCreateComponent, canActivate: [AuthGuard] },
  { path: 'venues/edit/:id', component: VenueEditComponent, canActivate: [AuthGuard] },
  { path: 'venues', component: VenueListComponent, canActivate: [AuthGuard] },
  { path: 'venues/:id', component: VenueDetailsComponent, canActivate: [AuthGuard] },

  // Category routes
  { path: 'categories/create', component: CategoryCreateComponent },
  { path: 'categories/edit/:id', component: CategoryEditComponent },
  { path: 'categories', component: CategoriesListComponent},

  // Protected routes (any authenticated user)
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Admin-only
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
  path: 'admin/categories',
  children: [
    { path: '', component: CategoriesListComponent },
    { path: 'create', component: CategoryCreateComponent },
    { path: 'edit/:id', component: CategoryEditComponent },
  ],
},


  // Organizer-only
  {
    path: 'organizer/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['organizer'] }
  },
  {
  path: 'organizer/events/edit/:id',
  component: EventEditComponent
  },
  {
  path: 'organizer/events/create',
  component: EventCreateComponent,
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['organizer'] }
},



  // Public routes
  { path: 'map', component: MapComponent },

  // Catch-all → go to login
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

