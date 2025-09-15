import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenueService } from '../../services/venue.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../models/models/user.model';
import { Router } from '@angular/router';
import { OrganizerCartService } from 'src/app/services/organizer-cart.service';

@Component({
  selector: 'app-venue-details',
  templateUrl: './venue-details.component.html',
  styleUrls: ['./venue-details.component.css'],
})
export class VenueDetailsComponent implements OnInit {
  venue: any;
  categoryName: string = '';
  showComments = false;
  currentUserRole = '';
  currentUser: User | null = null;

  toggleComment() {
    this.showComments = !this.showComments;
  }

  constructor(
    private route: ActivatedRoute,
    private venueService: VenueService,
    private authService: AuthService,
    private router: Router,
    private orgcart: OrganizerCartService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    console.log('✅ Current User:', user);
    this.currentUser = user;

    this.currentUserRole = user?.role?.toLowerCase() || '';
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.venueService.getVenueById(id).subscribe((response) => {
        this.venue = response.data.venue;
        this.categoryName = this.venue.categoryId.name;
      });
    }
  }

  addToCart(venueId: String, start: string, end: string) {
    const userID = this.currentUser?._id;
    const item = {
      venueId,
      organizerId: userID,
      end,
      start,
    };
    console.log(userID);
    console.log(start);
    console.log(end);
    console.log(venueId);

    this.orgcart.AddItemToCart(item).subscribe((data) => {
      console.log('Item added to cart:', data);
      this.router.navigate(['orgcart']);
    });
  }
}
