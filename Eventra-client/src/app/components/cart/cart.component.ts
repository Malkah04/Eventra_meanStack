import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any = null;
  userID: string = 'user123'; 

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart(this.userID).subscribe(
      (res) => this.cart = res,
      (err) => console.error(err)
    );
  }

  removeItem(eventID: string) {
    this.cartService.removeFromCart({ userID: this.userID, eventID }).subscribe(
      () => this.loadCart(),
      (err) => console.error(err)
    );
  }

  emptyCart() {
    this.cartService.emptyCart(this.userID).subscribe(
      () => this.loadCart(),
      (err) => console.error(err)
    );
  }

  checkout() {
    this.cartService.proceedToPayment(this.userID).subscribe(
      (res) => alert('Payment processed successfully!'),
      (err) => console.error(err)
    );
  }

}
