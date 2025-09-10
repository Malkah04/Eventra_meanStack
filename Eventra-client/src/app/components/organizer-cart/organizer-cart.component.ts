import { Component } from '@angular/core';
import { OrganizerCartService } from 'src/app/services/organizer-cart.service';

@Component({
  selector: 'app-organizer-cart',
  templateUrl: './organizer-cart.component.html',
  styleUrls: ['./organizer-cart.component.css'],
})
export class OrganizerCartComponent {
  cart: any[] = [];
  totalPrice = 0;
  constructor(private orgCartService: OrganizerCartService) {}

  ngOnInit(): void {
    this.getOrgCart();
  }
  item: any = {};
  orgId = '68bdd8c16a09216205615ecd';

  addToCart() {
    const item = { ...this.item, organizerId: this.orgId };
    this.orgCartService.AddItemToCart(item).subscribe((data) => {
      this.cart = data.cart.item;
      this.totalPrice = data.totalPrice;
    });
  }
  getOrgCart() {
    this.orgCartService.getCartByOrgId(this.orgId).subscribe((data) => {
      console.log('Cart API response:', data);
      this.cart = data.item;
      this.totalPrice = data.lastPrice;
    });
  }
  deleteItem(orgId: string, eventId?: string, venueId?: string) {
    const item = { organizerId: orgId, eventId: eventId, venueId: venueId };
    this.orgCartService.deleteItemFromCart(item).subscribe((data) => {
      this.cart = this.cart.filter(
        (e) =>
          !(
            e.organizerId === orgId &&
            (e.eventId === eventId || e.venueId === venueId)
          )
      );
    });
  }
  deleteCart(orgId: string) {
    this.orgCartService.deleteCart(orgId).subscribe((data) => {
      this.cart = [];
    });
  }
}
