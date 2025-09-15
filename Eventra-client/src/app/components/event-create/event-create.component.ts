import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  eventForm!: FormGroup;
  categories: any[] = [];
  venues: any[] = [];
  isLoading = false;
  selectedCategoryId: string = '';
  selectedVenueId: string = '';
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
    this.categoryService.getAll().subscribe({
      next: (res: any) => this.categories = res,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadVenues() {
    this.venueService.getMyVenues().subscribe({
      next: (res: any) => {
        // لو الريسبونس فيه data.venues
        this.venues = res?.data?.venues || res;
      },
      error: (err) => console.error('Error loading venues:', err)
    });
  }
onCategoryChange(): void {
    console.log('Selected Category:', this.selectedCategoryId);
}

  onSubmit() {
    if (this.eventForm.invalid) return;

    this.isLoading = true;
    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: () => {
        alert('✅ Event created successfully!');
        this.router.navigate(['/organizer/events']);
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert('❌ Failed to create event');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
