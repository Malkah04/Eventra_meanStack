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
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      images: ['']
    });

    this.loadCategories();
    this.loadVenues();
  }

  loadCategories() {
  this.categoryService.getAll().subscribe({
    next: (res: any) => {
      this.categories = res.data.categories;  // ✅ الصح
      console.log('📦 Categories loaded:', this.categories);
    },
    error: (err) => console.error('Error loading categories:', err)
  });
}


  loadVenues() {
  this.venueService.getVenues().subscribe({
    next: (res: any) => {
      console.log('Venues response:', res);
      this.venues = res.data.venues;  // أو حسب اللي بيرجعه السيرفر
    },
    error: (err) => console.error('Error loading venues:', err)
  });
}


  onSubmit() {
    console.log('🔴 FORM SUBMIT TRIGGERED!');
    console.log('Form Value:', this.eventForm.value);
    console.log('Valid?', this.eventForm.valid);

    if (this.eventForm.invalid) {
      alert('❌ Form is invalid!');
      return;
    }

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
