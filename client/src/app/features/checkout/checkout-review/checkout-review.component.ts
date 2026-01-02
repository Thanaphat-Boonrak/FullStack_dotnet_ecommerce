import { Component, effect, inject, input, type OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import type { ConfirmationToken } from '@stripe/stripe-js';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from "../../../shared/pipes/card-pipe";

@Component({
  selector: 'app-checkout-review',
  imports: [CurrencyPipe, AddressPipe, CardPipe],
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent{
  protected cartService = inject(CartService);
  confirmationToken = input<ConfirmationToken | null>(null);
  
}
