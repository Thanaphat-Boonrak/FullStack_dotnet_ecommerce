import type { Route } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { OrderComponent } from './order.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';

export const orderRoute: Route[] = [
  {
    path: '',
    component: OrderComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: OrderDetailedComponent,
    canActivate: [authGuard],
  },
];
