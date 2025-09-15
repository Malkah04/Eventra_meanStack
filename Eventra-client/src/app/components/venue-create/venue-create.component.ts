import { Component } from '@angular/core';
import { VenueService } from '../../services/venue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venue-create',
  templateUrl: './venue-create.component.html',
  styleUrls: ['./venue-create.component.css']
})
export class VenueCreateComponent {
  venue = {
    name: '',
    description: '',
    location: { x: 0, y: 0 },
    availability: {
      openTime: '',
      closeTime: '',
      days: [] as string[]
    },
    capacity: 0,
    pricePerHour: 0,
    features: [] as string[],
    images: [
      "https://redthread.uoregon.edu/files/original/affd16fd5264cab9197da4cd1a996f820e601ee4.png"
    ] as string[],
    categoryId: null as number | null
  };
  categories: any[] = [];
  
  featureInput = '';
  allDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(private venueService: VenueService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.venueService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error("Error loading categories", err);
      }
    });
  }
  
  addFeature(event: any) {
    if ((event.code === 'Enter' || event.code === 'NumpadEnter')) {
      event.preventDefault();
      const value = this.featureInput.trim();
      if (value && !this.venue.features.includes(value)) {
        this.venue.features.push(value);
      }
      this.featureInput = '';
    }
  }
  
  removeFeature(index: number) {
    this.venue.features.splice(index, 1);
  }

  // === Days ===
  toggleDay(day: string, event: any) {
    if (event.target.checked) {
      this.venue.availability.days.push(day);
    } else {
      this.venue.availability.days = this.venue.availability.days.filter(d => d !== day);
    }
  }

  // === Main Image Upload Preview ===
  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.venue.images[0] = e.target.result; // preview
      };
      reader.readAsDataURL(file);
    }
  }

  // === Save Venue ===
  saveVenue() {
    this.venueService.createVenue(this.venue).subscribe({
      next: (res) => {
        console.log('Venue created:', res);
        this.router.navigate(['/venues']);
      },
      error: (err) => {console.error(err);alert('Error creating venue');}
    });
  }
}
