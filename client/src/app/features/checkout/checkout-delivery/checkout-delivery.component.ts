import { Component, inject, output, type OnInit } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import type { DeliveryMethod } from '../../../shared/models/deliveryMethod';
@Component({
  selector: 'app-checkout-delivery',
  imports: [MatRadioModule, CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss',
})
export class CheckoutDeliveryComponent implements OnInit {
  protected checkoutService = inject(CheckoutService);
  protected cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethod().subscribe({
      next: (methods) => {
        if (this.cartService.cart()?.deliveryMethodId) {
          const method = methods.find((x) => x.id === this.cartService.cart()?.deliveryMethodId);
          if (method) {
            this.cartService.selectedDelivery.set(method);
            this.deliveryComplete.emit(true);
          }
        }
      },
    });
  }

  updateDeliveryMethod(method: DeliveryMethod) {
  this.cartService.selectedDelivery.set(method);

  this.cartService.cart.update(cart => {
    if (!cart) return cart;
    return {
      ...cart,
      deliveryMethodId: method.id
    };
  });

  this.cartService.setCart(this.cartService.cart()!);

  this.deliveryComplete.emit(true);
}

}
