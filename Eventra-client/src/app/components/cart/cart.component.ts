import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = { items: [] };
  userID = "123"; // ✨ هنا هتجيبيه من AuthService أو localStorage

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.cartService.getCart(this.userID).subscribe((res: any) => {
      this.cart = res.data || { items: [] };
    });
  }

  removeItem(eventID: string): void {
    this.cartService.removeFromCart({ userID: this.userID, eventID }).subscribe(() => {
      this.getCart();
    });
  }

  updateQuantity(eventID: string, quantity: number): void {
    this.cartService.updateQuantity({ userID: this.userID, eventID, quantity }).subscribe(() => {
      this.getCart();
    });
  }

  emptyCart(): void {
    this.cartService.emptyCart({ userID: this.userID }).subscribe(() => {
      this.getCart();
    });
  }

  checkout(): void {
    this.cartService.checkout({ userID: this.userID }).subscribe(() => {
      alert("Checkout successful ✅");
      this.getCart();
    });
  }
}
