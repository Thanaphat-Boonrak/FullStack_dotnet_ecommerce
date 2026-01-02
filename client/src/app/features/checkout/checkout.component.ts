import { Component, inject, signal, type OnDestroy, type OnInit } from '@angular/core';
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';

import { MatStepperModule, type MatStepper } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { StripeService } from '../../core/services/stripe.service';
import type {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
  StripeShippingAddressElementChangeEvent,
} from '@stripe/stripe-js';
import { SnackbarService } from '../../core/services/snackbar.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import type { StepperSelectionEvent } from '@angular/cdk/stepper';
import type { Address } from '../../shared/models/user';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, JsonPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { OrderToCreate, ShippingAddress } from '../../shared/models/order';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [
    OrderSummaryComponent,
    MatStepperModule,
    RouterLink,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CurrencyPipe,
    JsonPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private stripeService = inject(StripeService);
  private router = inject(Router);
  private snackBar = inject(SnackbarService);
  protected cartService = inject(CartService);
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  private accountService = inject(AccountService);
  private orderService = inject(OrderService)
  confirmationToken = signal<ConfirmationToken | null>(null);
  completionStatus = signal<{ address: boolean; card: boolean; delivery: boolean }>({
    address: false,
    card: false,
    delivery: false,
  });
  saveAddress = false;
  loading = false;

  async ngOnInit() {
    try {
      this.addressElement = await this.stripeService.createAddressElement();
      this.paymentElement = await this.stripeService.createPaymentElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddresChange);
      this.paymentElement.mount('#payment-element');
      this.paymentElement.on('change', this.handlePaymentChange);
    } catch (e: any) {
      this.snackBar.error(e.message);
    }
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update((state) => ({
      ...state,
      card: event.complete,
    }));
  };
  handleAddresChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update((state) => ({
      ...state,
      address: event.complete,
    }));
  };

  handleDeliveryChange(event: boolean) {
    this.completionStatus.update((state) => ({
      ...state,
      delivery: event,
    }));

  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus()).every((status) => status === true)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken.set(result.confirmationToken);
        console.log(this.confirmationToken());
      }
    } catch (err: any) {
      this.snackBar.error(err.message);
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken()) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken()!);
        if (result.paymentIntent?.status === 'succeeded') {
          const order = await this.createOrderModel();
          const orderResult = await firstValueFrom(this.orderService.createOrder(order));
          if (orderResult) {
            this.cartService.deleteCart();
            this.cartService.selectedDelivery.set(null);
            this.router.navigateByUrl('/checkout/success');
            this.orderService.orderComplete.set(true)
          } else {
            throw new Error('Order creation failed');
          }
        } else if (result.error) {
          throw new Error(result.error?.message);
        }
      }
    } catch (error: any) {
      this.snackBar.error(error.message || 'Something went wrong');
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

  private async createOrderModel(): Promise<OrderToCreate> {
    const cart = this.cartService.cart();
    const shippingAddress = (await this.getAddressFromStripeAddress()) as ShippingAddress;
    const card = this.confirmationToken()?.payment_method_preview.card;
    if (!cart?.id || !cart.deliveryMethodId || !cart || !shippingAddress) {
      throw new Error('Problem creating Order');
    }

    return {
      cartId: cart.id,
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress: shippingAddress,
      paymentSummary: {
        last4: +card!.last4,
        brand: card!.brand,
        expMonth: card!.exp_month,
        expYear: card!.exp_year,
      },
    };
  }

  async onstepChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = (await this.getAddressFromStripeAddress()) as Address;
        address && (await firstValueFrom(this.accountService.updateAddress(address)));
      }
    }

    if (event.selectedIndex === 2) {
      const cart = this.cartService.cart();
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
      
    }

    if (event.selectedIndex === 3) {
      await this.getConfirmationToken();
    }
  }

  private async getAddressFromStripeAddress(): Promise<Address | ShippingAddress | null> {
    const result = await this.addressElement?.getValue();
    const address = result?.value.address;
    if (address) {
      return {
        name: result.value.name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postal_code,
      };
    } else {
      return null;
    }
  }
  onsaveAddressCheckboxChange($event: MatCheckboxChange) {
    this.saveAddress = $event.checked;
  }

  ngOnDestroy(): void {
    this.stripeService.disposeElements();
  }
}
