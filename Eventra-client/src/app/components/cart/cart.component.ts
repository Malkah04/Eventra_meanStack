import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = { items: [] };
  userID: string = '';
  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserIdAndLoadCart();
  }

  private getUserIdAndLoadCart(): void {
    const user = this.authService.getCurrentUser();
    if (user && user._id) {
      this.userID = user._id;
      this.getCart();
    } else {
      console.error('No user logged in');
      // Handle not logged in state - maybe redirect to login
    }
  }

  getCart(): void {
    this.isLoading = true;
    this.cartService.getCart(this.userID).subscribe({
      next: (res: any) => {
        this.cart = res.data || { items: [] };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.isLoading = false;
        // Handle error - maybe show error message to user
      }
    });
  }

  removeItem(eventID: string): void {
    if (!eventID) return;

    this.isLoading = true;
    this.cartService.removeFromCart({ userID: this.userID, eventID }).subscribe({
      next: () => {
        this.getCart();
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.isLoading = false;
        // Handle error - maybe show error message to user
      }
    });
  }

  updateQuantity(eventID: string, quantity: number): void {
    if (!eventID || quantity < 1) return;

    this.isLoading = true;
    this.cartService.updateQuantity({ userID: this.userID, eventID, quantity }).subscribe({
      next: () => {
        this.getCart();
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
        this.isLoading = false;
        // Handle error - maybe show error message to user
      }
    });
  }

  emptyCart(): void {
    if (confirm('Are you sure you want to empty your cart?')) {
      this.isLoading = true;
      this.cartService.emptyCart({ userID: this.userID }).subscribe({
        next: () => {
          this.getCart();
        },
        error: (error: Error) => {
          console.error('Error emptying cart:', error);
          this.isLoading = false;
          // Handle error - maybe show error message to user
        }
      });
    }
  }

  checkout(): void {
    this.isLoading = true;
    this.cartService.checkout({ userID: this.userID }).subscribe({
      next: (response: { url?: string; data?: any }) => {
        this.isLoading = false;
        // If using Stripe, redirect to Stripe checkout
        if (response.url) {
          window.location.href = response.url;
        } else {
          alert('Payment processed successfully! ✅');
          this.getCart();
        }
      },
      error: (error: Error) => {
        console.error('Error during checkout:', error);
        this.isLoading = false;
        alert('Checkout failed. Please try again.');
      }
    });
  }
}
