import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  loadStripe,
  type ConfirmationToken,
  type Stripe,
  type StripeAddressElement,
  type StripeAddressElementOptions,
  type StripeElements,
  type StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from '../../environments/environment.development';
import { firstValueFrom, tap } from 'rxjs';
import type { Cart } from '../../shared/models/cart';
import { CartService } from './cart.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripPromise?: Promise<Stripe | null>;
  private http = inject(HttpClient);
  private baseUrl = environment.baseAPI;
  private cartService = inject(CartService);
  private accountService = inject(AccountService);
  private elements?: StripeElements;
  private elementsAddress?: StripeAddressElement;
  private elementsPayment?: StripePaymentElement;

  constructor() {
    this.stripPromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripPromise;
  }

  async intializedElemnets() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: { labels: 'floating' },
        });
      } else {
        throw new Error('Stripe has not been loaded');
      }
    }
    return this.elements;
  }

  async createConfirmationToken() {
    const stripe = await this.getStripeInstance();
    const elements = await this.intializedElemnets();
    const result = await elements.submit();
    if(result.error){
      throw new Error(result.error.message)
    }
    if(stripe){
      return await stripe.createConfirmationToken({elements})
    }else{
      throw new Error('Stripe not available')
    }
  }


  async confirmPayment(confirmationToken: ConfirmationToken){
   const stripe = await this.getStripeInstance();
    const elements = await this.intializedElemnets();
    const result = await elements.submit();
    if(result.error){
      throw new Error(result.error.message)
    }
    
    
    const clientSecret = this.cartService.cart()?.clientSecret;

    if(stripe && clientSecret){
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: confirmationToken.id
        },
        redirect: 'if_required'
      })
    }else{
      throw new Error('Unable to load Stripe')
    }
  }

  async createAddressElement() {
    if (!this.elementsAddress) {
      const elements = await this.intializedElemnets();
      if (elements) {
        const user = this.accountService.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }

        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            postal_code: user.address.postalCode,
          };
        }
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues,
        };
        this.elementsAddress = elements.create('address', options);
      } else {
        throw new Error('Elements instance has not been loaded');
      }
    }
    return this.elementsAddress;
  }

  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Problem with cart');
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      tap((cart) => {
        this.cartService.setCart(cart);
        return cart;
      })
    );
  }

  async createPaymentElement() {
    if (!this.elementsPayment) {
      const element = await this.intializedElemnets();
      if (element) {
        this.elementsPayment = element.create('payment');
      } else {
        throw new Error('Elemnet instance has not benn initialized');
      }
    }
    return this.elementsPayment;
  }

  disposeElements() {
    this.elements = undefined;
    this.elementsAddress = undefined;
    this.elementsPayment = undefined;
  }
}
