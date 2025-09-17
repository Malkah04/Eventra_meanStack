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
  styleUrls: ['./venue-list.component.css'],
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
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadVenues();
      });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log('✅ Current User:', user);

    this.currentUserRole = user?.role?.toLowerCase() || '';
    this.currentUserId = user?._id?.toLowerCase() || '';

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
        console.log(res);

        this.venues = res.data.venues;
        this.filteredVenues = this.venues;
        this.loading = false;
      });
    } else {
      if (this.currentUserRole === '') {
        return;
      }
      this.venueService.getVenues(1, 100, categoryId).subscribe((res: any) => {
        this.venues = res.data.venues;
        this.filteredVenues = this.venues;
        this.loading = false;
      });
    }
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

  searhText: string = '';

  search(searchItem: string) {
    this.venueService.search(searchItem).subscribe((data) => {
      this.venues = data.result;
      console.log(data.result);
      this.filteredVenues = this.venues;
      this.loading = false;
    });
  }
  filters = {
    price: '',
    capacity: '',
    days: '',
    openTime: '',
    closeTime: '',
    categoryId: '',
  };
  showFilter = false;

  toggle() {
    this.showFilter = !this.showFilter;
  }

  daysList = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  filter() {
    const query: any = {};
    this.filters.openTime = this.filters.openTime
      ? this.filters.openTime.toString()
      : '';
    this.filters.closeTime = this.filters.closeTime
      ? this.filters.closeTime.toString()
      : '';

    Object.keys(this.filters).forEach((key) => {
      if (this.filters[key as keyof typeof this.filters]) {
        query[key] = this.filters[key as keyof typeof this.filters];
      }
    });
    console.log(this.filters.openTime);

    this.loading = true;
    this.venueService.filter(query).subscribe({
      next: (res: any) => {
        this.venues = res.venues || res;
        this.filteredVenues = this.venues;
        this.loading = false;
        this.showFilter = false;
      },
      error: (err) => {
        console.error(err);
        this.filteredVenues = this.venues;
        this.loading = false;
        this.showFilter = false;
      },
    });
  }
}
