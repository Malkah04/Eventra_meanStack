import { Component, Input } from '@angular/core';
import { OrganizerCartService } from 'src/app/services/organizer-cart.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { VenueService } from 'src/app/services/venue.service';

@Component({
  selector: 'app-organizer-cart',
  templateUrl: './organizer-cart.component.html',
  styleUrls: ['./organizer-cart.component.css'],
})
export class OrganizerCartComponent {
  cart: any[] = [];
  totalPrice = 0;
  currentUser: User | null = null;

  userId: string = '';
  constructor(
    private orgCartService: OrganizerCartService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private venueService: VenueService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = user;
    if (this.currentUser) {
      this.userId = this.currentUser._id;
      this.getOrgCart();
    }
  }
  item: any = {};

  addToCart() {
    const item = { ...this.item, organizerId: this.userId };
    this.orgCartService.AddItemToCart(item).subscribe((data) => {
      this.cart = data.cart.item;
      this.totalPrice = data.totalPrice;
    });
  }
  getOrgCart() {
    this.orgCartService.getCartByOrgId(this.userId).subscribe((data) => {
      console.log('Cart API response:', data);
      this.cart = data.item;
      this.totalPrice = data.lastPrice;

      this.cart.forEach((c, index) => {
        if (c.venueId) {
          this.venueService.getVenueById(c.venueId).subscribe((venueData) => {
            this.cart[index].venue = venueData.data.venue;
            console.log(this.cart[index].venue);
          });
        }
      });
    });
  }
  deleteItem(eventId?: string, venueId?: string) {
    const item = {
      organizerId: this.userId,
      eventId,
      venueId,
    };

    this.orgCartService.deleteItemFromCart(item).subscribe(() => {
      this.cart = this.cart.filter((e) => {
        if (eventId) {
          return !(e.organizerId === this.userId && e.eventId === eventId);
        }
        return !(e.organizerId === this.userId && e.venueId === venueId);
      });
    });
    this.getOrgCart();
  }

  deleteCart() {
    this.orgCartService.deleteCart(this.userId).subscribe((data) => {
      this.cart = [];
    });
  }
  venues: any = '';
}
