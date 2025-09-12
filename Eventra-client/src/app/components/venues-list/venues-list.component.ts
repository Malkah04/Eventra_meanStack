import { Component, OnInit } from '@angular/core';
import { VenueService } from '../../services/venue.service';
import { Venue } from '../../models/models/venue.model';

@Component({
  selector: 'app-venues-list',
  templateUrl: './venues-list.component.html',
  styleUrls: ['./venues-list.component.css']
})
export class VenuesListComponent implements OnInit {
  venues: Venue[] = [];
  cities: string[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  totalVenues = 0;
  pageSize = 12;
  selectedCity = '';

  constructor(private venueService: VenueService) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadVenues();
  }

  loadCities(): void {
    this.venueService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadVenues(): void {
    this.isLoading = true;
    
    this.venueService.getVenues(this.currentPage, this.pageSize, this.selectedCity).subscribe({
      next: (response) => {
        this.venues = response.venues;
        this.totalPages = response.totalPages;
        this.totalVenues = response.totalVenues;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading venues:', error);
        this.isLoading = false;
      }
    });
  }

  onCityChange(): void {
    this.currentPage = 1;
    this.loadVenues();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVenues();
      window.scrollTo(0, 0);
    }
  }

  formatPrice(price: number): string {
    return `$${price}/day`;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}