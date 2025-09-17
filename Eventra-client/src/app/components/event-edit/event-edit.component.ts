import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { VenueService } from '../../services/venue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { VenueService } from 'src/app/services/venue.service';

import { Event } from 'src/app/models/models/event.model';
import { Category } from 'src/app/models/models/category.model';
import { Venue } from 'src/app/models/models/venue.model';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  venues: any[] = [];
  isLoading = false;
  eventId!: string;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      venueId: ['', Validators.required],
      ticketPrice: [0, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      images: [[]]
    });

    this.loadCategories();
    this.loadVenues();
    this.loadEvent();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data.categories;
    });
  }

  loadVenues() {
    this.venueService.getVenues().subscribe((res: any) => {
      this.venues = res.data.venues;
    });
  }


  loadEvent() {
    this.eventService.getEventById(this.eventId).subscribe((res: any) => {
      const event = res.data.event;
      this.eventForm.patchValue({
        name: event.name,
        description: event.description,
        categoryId: event.categoryId._id,
        venueId: event.venueId._id,
        ticketPrice: event.ticketPrice,
        date: event.date,
        time: event.time,
        images: event.images

    // تحميل الفئات والأماكن
    this.categoryService.getAll().subscribe((cats) => (this.categories = cats));
    this.venueService
      .getMyVenues()
      .subscribe((venues) => (this.venues = venues));

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

    if (this.eventForm.invalid) return;

    this.isLoading = true;
    this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/events']);
      },
      error: () => this.isLoading = false
    });

    if (this.eventForm.valid) {
      this.eventService
        .updateEvent(this.eventId, this.eventForm.value)
        .subscribe(() => {
          this.router.navigate(['/organizer/events']);
        });
    }
  }
}
