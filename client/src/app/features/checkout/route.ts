import type { Route } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { authGuard } from '../../core/guards/auth-guard';
import { cartGuard } from '../../core/guards/cart-guard';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { checkoutSuccessGuard } from '../../core/guards/checkout-success-guard';

export const checkoutRoutes: Route[] = [
  {
    path: '',
    component: CheckoutComponent,
    canActivate: [authGuard, cartGuard],
  },
  {
    path: 'success',
    component: CheckoutSuccessComponent,
    canActivate: [authGuard, checkoutSuccessGuard],
  },
];
