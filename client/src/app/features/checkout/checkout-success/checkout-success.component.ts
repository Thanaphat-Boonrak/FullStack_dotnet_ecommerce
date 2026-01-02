import { Component, inject, type OnDestroy } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SignalrService } from '../../../core/services/signalr.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-success',
  imports: [MatButton, RouterLink, DatePipe, CurrencyPipe, AddressPipe, CardPipe, MatProgressSpinner],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent implements OnDestroy {
    
    protected signalService = inject(SignalrService)
    private orderService = inject(OrderService)
    ngOnDestroy(): void {
      this.orderService.orderComplete.set(false)
      this.signalService.order.set(null)
    }
}
