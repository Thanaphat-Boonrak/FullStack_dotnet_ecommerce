import { Routes } from '@angular/router';
import { ShopComponent } from './features/shop/shop.component';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailsComponent } from './features/shop/product-details/product-details.component';
import { TestComponent } from './features/test/test.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { cartGuard } from './core/guards/cart-guard';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';
import { OrderComponent } from './features/orders/order.component';
import { OrderDetailedComponent } from './features/orders/order-detailed/order-detailed.component';
import { checkoutSuccessGuard } from './core/guards/checkout-success-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'shop',
    component: ShopComponent,
  },
  {
    path: 'shop/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard, cartGuard],
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccessComponent,
    canActivate: [authGuard,checkoutSuccessGuard],
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders/:id',
    component: OrderDetailedComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account/login',
    component: LoginComponent,
  },
  {
    path: 'account/register',
    component: RegisterComponent,
  },

  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
  },
  {
    path: 'test-error',
    component: TestComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];
