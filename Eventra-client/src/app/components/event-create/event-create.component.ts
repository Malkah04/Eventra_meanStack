import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { VenueService } from 'src/app/services/venue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html'
})
export class EventCreateComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  venues: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      venueId: ['', Validators.required],
      ticketPrice: [0, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });

    this.loadCategories();
    this.loadVenues();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
  this.categories = res;
});

  }

  loadVenues() {
    this.venueService.getMyVenues().subscribe((res: any[]) => {
      this.venues = res;
    });
  }
  goToCreateEvent() {
  this.router.navigate(['/events/create']);
}

  onSubmit() {
    if (this.eventForm.valid) {
      this.eventService.createEvent(this.eventForm.value).subscribe(() => {
        alert('Event Created Successfully!');
        this.router.navigate(['/organizer/events']);

      });
    }
  }
}
