// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-venue-list',
//   templateUrl: './venue-list.component.html',
//   styleUrls: ['./venue-list.component.css']
// })
// export class VenueListComponent {

// }
import { Component, OnInit } from '@angular/core';
import { Router, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VenueService } from 'src/app/services/venue.service';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { userInfo } from 'os';

@Component({
  selector: 'app-venue-list',
  templateUrl: './venue-list.component.html',
  styleUrls: ['./venue-list.component.css']
})
export class VenueListComponent implements OnInit {
  venues: any[] = [];
  categories: any[] = [];
  selectedCategoryId: string = '';
  loading = false;
  currentUserRole = '';
  currentUserId: string = '';
  filteredVenues: any[] = [];

  constructor(
    private venueService: VenueService,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService
  ) {
    // Reload venues on navigation
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadVenues();
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log('✅ Current User:', user);

    this.currentUserRole = user?.role?.toLowerCase() || '';

    this.loadVenues();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      console.log('Categories from API:', res);
      this.categories = res.data.categories; // حسب الـ API
    });
  }

  loadVenues(categoryId?: string) {
    console.log('currentUserRole:', this.currentUserRole);
    this.loading = true;
    
    if (this.currentUserRole === 'organizer') {
      this.venueService.getMyVenuesByOwner(categoryId).subscribe((res: any) => {
        this.venues = res.data.venues;
        this.filteredVenues = this.venues;
        this.loading = false;
      });
    }else {
      if (this.currentUserRole === '') {
        return
      }
      this.venueService.getVenues(1, 100, categoryId).subscribe((res: any) => {
        this.venues = res.data.venues;
        this.filteredVenues = this.venues;
        this.loading = false;
      });
    }
    // this.venueService.getVenues(1, 100, categoryId).subscribe((res: any) => {
    //   console.log('Venues response:', res);
    //   const user = JSON.parse(localStorage.getItem('user') || '{}');
    //   const userId = user._id;

    //   this.venues = res.data.venues;
    //   if (this.currentUserRole === 'organizer') {
    //     this.filteredVenues = this.venues.filter(v => v.ownerId === userId);
    //   } else {
    //     this.filteredVenues = this.venues;
    //   }
    //   this.loading = false;
    // });
  }

  onCategoryChange() {
    console.log('Category changed:', this.selectedCategoryId);
    this.loadVenues(this.selectedCategoryId);
  }

  goToCreate() {
    this.router.navigate(['/venues/create']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/venues/edit', id]);
  }

  goToDetails(id: string) {
    this.router.navigate(['/venues', id]);
  }

  deleteVenue(id: string) {
    if (confirm('Are you sure you want to delete this venue?')) {
      this.venueService.deleteVenue(id).subscribe(() => {
        alert('Venue deleted!');
        this.loadVenues();
      });
    }
  }
}
