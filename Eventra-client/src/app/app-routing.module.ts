import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/guards/auth.guard';
import { RoleGuard } from './guards/guards/role.guard';

// Auth Components
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// Event Components
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventEditComponent } from './components/event-edit/event-edit.component';
import { EventsListComponent } from './components/event-list/event-list.component';

// Venue Components
import { VenueCreateComponent } from './components/venue-create/venue-create.component';
import { VenueEditComponent } from './components/venue-edit/venue-edit.component';
import { VenueListComponent } from './components/venue-list/venue-list.component';
import { VenueDetailsComponent } from './components/venue-details/venue-details.component';

// Category Components
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { CategoriesListComponent } from './components/category-list/category-list.component';

// User / Admin Components
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { UsersListComponent } from './components/users-list/users-list.component';

// Other Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
import { OrganizerCartComponent } from './components/organizer-cart/organizer-cart.component';

const routes: Routes = [
  // Default
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Events (محمي)
  { path: 'events/create', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'events/edit/:id', component: EventEditComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsListComponent, canActivate: [AuthGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },

  // Venues (محمي)
  { path: 'venues/create', component: VenueCreateComponent, canActivate: [AuthGuard] },
  { path: 'venues/edit/:id', component: VenueEditComponent, canActivate: [AuthGuard] },
  { path: 'venues', component: VenueListComponent, canActivate: [AuthGuard] },
  { path: 'venues/:id', component: VenueDetailsComponent, canActivate: [AuthGuard] },

  // Categories (مفتوحة دلوقتي)
  { path: 'categories/create', component: CategoryCreateComponent },
  { path: 'categories/edit/:id', component: CategoryEditComponent },
  { path: 'categories', component: CategoriesListComponent },

  // Organizer cart
  { path: 'orgcart', component: OrganizerCartComponent, canActivate: [AuthGuard] },

  // User Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Admin
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
  { path: 'admin/users', component: UsersListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },

  // Organizer Dashboard
  { path: 'organizer/dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['organizer'] } },

  // Profiles
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },          // Profile Settings (المستخدم الحالي)
  { path: 'users/:id/profile', component: PublicProfileComponent },                    // Public Profile لأي مستخدم تاني

  // Map
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },

  // Wildcard
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
