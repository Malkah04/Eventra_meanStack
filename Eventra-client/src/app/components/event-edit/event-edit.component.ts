import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { VenueService } from '../../services/venue.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  }
}
