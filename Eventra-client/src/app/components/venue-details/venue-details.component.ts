import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenueService } from '../../services/venue.service';

@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css']
})

export class VenueDetailsComponent implements OnInit {
  venue: any;
  categoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private venueService: VenueService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.venueService.getVenueById(id).subscribe(response => {
        this.venue = response.data.venue;
        this.categoryName = this.venue.categoryId.name;
      });
    }
  }
}