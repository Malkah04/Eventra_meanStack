import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-venue-edit',
  templateUrl: './venue-edit.component.html',
  styleUrls: ['./venue-edit.component.css']
})
export class VenueEditComponent implements OnInit {
  venueId!: string;
  venue: any = {};
  featureInput: string = '';
  categories: any[] = [];

  map: any;
  mapVisible = false;

  constructor(private route: ActivatedRoute, private venueService: VenueService, private router: Router) {}

  ngOnInit(): void {
    this.venueId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();
    this.loadVenue();
  }

  loadCategories() {
    this.venueService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // document.querySelector('select[name="categoryId"').value = "";
      },
      error: (err) => {
        console.error("Error loading categories", err);
      }
    });
  }

  loadVenue() {
    this.venueService.getVenue(this.venueId).subscribe((data) => {
      this.venue = data.data.venue;
      if (this.venue.categoryId && typeof this.venue.categoryId === 'object') {
        this.venue.categoryId = this.venue.categoryId._id;
        console.log("CAAAAAAAAAAAAAAT"+this.venue.categoryId);
      }
    });
  }

    allDays: string[] = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  allFeatures: string[] = [
    "Stage", "Catering Service", "Lighting", "Parking", "Live Band Area"
  ];

  toggleDay(day: string, event: any) {
    if (event.target.checked) {
      this.venue.availability.days.push(day);
    } else {
      this.venue.availability.days = this.venue.availability.days.filter((d: string) => d !== day);
    }
  }

  toggleFeature(feature: string, event: any) {
    if (event.target.checked) {
      this.venue.features.push(feature);
    } else {
      this.venue.features = this.venue.features.filter((f: string) => f !== feature);
    }
  }

  addImage() {
    this.venue.images.push('');
  }

  removeImage(index: number) {
    this.venue.images.splice(index, 1);
  }

  saveVenue() {
    this.venueService.updateVenue(this.venue.id, this.venue).subscribe({
      next: (res) => this.router.navigate(['/venues']),
      error: (err) => alert('Error updating venue')
    });
  }

  onMainImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Replace the first image (main image)
        this.venue.images[0] = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
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

  openMap() {
    this.mapVisible = true;
    setTimeout(() => {
      // if (!this.map) {
        this.map = L.map('map').setView([30.0444, 31.2357], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        this.map.on('click', (e: any) => {
          this.venue.location = {
            x: e.latlng.lat,
            y: e.latlng.lng
          };
          // this.mapVisible = false;
        });
      // } else {
      //   this.map.invalidateSize();
      // }
    }, 100);
  }

  closeMap() {
    this.mapVisible = false;
  }
}
