import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any = null;
  userID: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.extractUserID();
    this.loadCart();
  }

  // ✅ استخرج الـ userID من الـ token
  extractUserID() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
      this.userID = payload.userID;
    }
  }

  loadCart() {
    this.cartService.getCart(this.userID).subscribe(
      (res) => this.cart = res.data.cart, 
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

  updateQuantity(eventID: string, newQuantity: number) {
    this.cartService.updateQuantity({ userID: this.userID, eventID, quantity: newQuantity }).subscribe(
      () => this.loadCart(),
      (err) => console.error(err)
    );
  }

  checkout() {
    this.cartService.proceedToPayment(this.userID).subscribe(
      () => alert('Payment processed successfully!'),
      (err) => console.error(err)
    );
  }
}

