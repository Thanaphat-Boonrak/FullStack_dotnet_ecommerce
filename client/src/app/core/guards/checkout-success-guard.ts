import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { SignalrService } from '../services/signalr.service';

export const checkoutSuccessGuard: CanActivateFn = (route, state) => {
    const orderService = inject(OrderService)
    const signalService = inject(SignalrService)
    const router = inject(Router)
    if(!orderService.orderComplete() && !signalService.order()){
      router.navigateByUrl("/shop")
      return false
    }
    return true
};
