import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/models/event.model'
import { response } from 'express';
import { Router, Event as RouterEvent, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: any[] = [];
  categories: any[] = [];
  selectedCategoryId: string = '';
  loading = false;
  currentUserRole= '';
  constructor(private eventService: EventService,private categoryService: CategoryService, private router: Router,private authService: AuthService) {
  this.router.events.pipe(
  filter((event: RouterEvent) => event instanceof NavigationEnd)
).subscribe(() => {
  this.loadEvents();
});

}
  ngOnInit(): void {
  const user = this.authService.getCurrentUser();
  console.log('✅ Current User:', user);

  this.currentUserRole = user?.role?.toLowerCase() || '';
  
  this.loadEvents();
  this.loadCategories();
  }
formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
 loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      console.log('Categories from API:', res);
      this.categories = res.data.categories;  // أو حسب شكل الرد
    });
  }
  loadEvents(categoryId?: string) {
  console.log('Selected Category ID:', categoryId);
  this.loading = true;
  this.eventService.getEvents(1, 100, categoryId).subscribe((res: any) => {
    console.log('API response:', res);
    this.events = res.data.events;
    this.loading = false;
  });
}

 onCategoryChange() {
  console.log('Category changed:', this.selectedCategoryId);
  this.loadEvents(this.selectedCategoryId);
}



goToCreate() {
    this.router.navigate(['/organizer/events/create']);
  }
goToEdit(id: string) {
  this.router.navigate(['/events/edit', id]);
}

goToDetails(id: string) {
  this.router.navigate(['/events', id]);
}
deleteEvent(id: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        alert('Event deleted!');
        this.loadEvents();
      });
    }
  }
}