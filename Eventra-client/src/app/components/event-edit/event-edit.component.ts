import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { VenueService } from 'src/app/services/venue.service';

import { Event } from 'src/app/models/models/event.model'
import { Category } from 'src/app/models/models/category.model';
import { Venue } from 'src/app/models/models/venue.model';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
})
export class EventEditComponent implements OnInit {
  eventForm!: FormGroup;
  eventId: string = '';
  categories: Category[] = [];
  venues: Venue[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    // تحميل الفئات والأماكن
    this.categoryService.getAll().subscribe((cats) => (this.categories = cats));
    this.venueService.getMyVenues().subscribe((venues) => (this.venues = venues));

    // تحميل بيانات الحدث
    this.eventService.getEventById(this.eventId).subscribe((eventData) => {
      this.eventForm = this.fb.group({
        name: [eventData.name, Validators.required],
        description: [eventData.description],
        categoryId: [eventData.categoryId, Validators.required],
        venueId: [eventData.venueId, Validators.required],
        ticketPrice: [eventData.ticketPrice, Validators.required],
        date: [eventData.date, Validators.required],
        time: [eventData.time, Validators.required],
      });
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe(() => {
        this.router.navigate(['/organizer/events']);
      });
    }
  }
}
