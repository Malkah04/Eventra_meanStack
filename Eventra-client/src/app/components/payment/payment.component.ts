import { Component, Input } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}
  @Input() cartId: string = '';
  @Input() userId: string = '';
  @Input() amount: number = 0;

  checkout() {
    this.paymentService
      .checkOut(this.cartId, this.userId, this.amount)
      .subscribe((data) => {
        window.location.href = data.url;
        console.log(data.url);
      });
  }
}
