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
  currentUserId= '';
  filteredEvents: any[] = [];
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
  this.currentUserId = user?._id?.toLowerCase() || '';

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
      this.categories = res.data.categories;
    });
  }
  loadEvents(categoryId?: string) {
    this.loading = true;

    if (this.currentUserRole === 'organizer') {
      this.eventService.getMyEvents(categoryId).subscribe((res: any) => {
        this.events = res.data.events;
        this.filteredEvents = this.events;
        this.loading = false;
      });
    } else {
      if (this.currentUserRole === '') {
        return;
      }
      this.eventService.getEvents(1, 100, categoryId).subscribe((res: any) => {
        this.events = res.data.events;
        this.filteredEvents = this.events;
        this.loading = false;
      });
    }
  }


  onCategoryChange() {
  console.log('Category changed:', this.selectedCategoryId);

  if (this.selectedCategoryId) {
    this.filteredEvents = this.events.filter(
      event => event.categoryId?._id === this.selectedCategoryId
    );
  } else {
    this.filteredEvents = [...this.events];
  }
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