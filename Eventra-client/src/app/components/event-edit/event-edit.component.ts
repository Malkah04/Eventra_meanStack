import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { VenueService } from 'src/app/services/venue.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Event } from 'src/app/models/models/event.model';
import { Category } from 'src/app/models/models/category.model';
import { Venue } from 'src/app/models/models/venue.model';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  eventForm!: FormGroup;
  categories: Category[] = [];
  venues: Venue[] = [];
  isLoading = false;
  eventId!: string;
  originalImage: string = '';

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
      images: [[]],
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
      this.originalImage = event.image[0];
      this.mainImagePreview = this.originalImage;
      const formattedDate = event.date ? event.date.split('T')[0] : '';

      this.eventForm.patchValue({
        name: event.name,
        description: event.description,
        categoryId: event.categoryId._id,
        venueId: event.venueId._id,
        ticketPrice: event.ticketPrice,
        date: formattedDate,
        time: event.time,
        images: event.images,
      });
    });
  }

  onSubmit() {
  console.log('🟡 EDIT FORM SUBMIT!');
  console.log('Form Value:', this.eventForm.value);

  if (this.eventForm.invalid) {
    alert('❌ Form is invalid!');
    return;
  }

  this.isLoading = true;

  const form = { ...this.eventForm.value };

  if (this.mainImagePreview && this.mainImagePreview !== this.originalImage) {
    form.image = [this.mainImagePreview];
  } else {
    form.image = [this.originalImage];
  }

  this.eventService.updateEvent(this.eventId, form).subscribe({
    next: () => {
      alert('✅ Event updated successfully!');
      this.router.navigate(['/organizer/events']);
    },
    error: (err) => {
      console.error('❌ Error updating event:', err);
      alert('❌ Failed to update event');
    },
    complete: () => {
      this.isLoading = false;
    },
  });
}
  
  mainImagePreview: string | ArrayBuffer | null = "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png";

  onMainImageSelected(event: any) {
  const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = reader.result;
      };
      reader.readAsDataURL(file);

    }
  }
}
