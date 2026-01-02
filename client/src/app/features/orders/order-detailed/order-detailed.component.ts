import { Component, inject, signal, type OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Order } from '../../../shared/models/order';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';

@Component({
  selector: 'app-order-detailed',
  imports: [MatCardModule, MatButton, DatePipe, CurrencyPipe, AddressPipe, CardPipe, RouterLink],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss',
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  protected order = signal<Order | null>(null);

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.orderService.getOrderDetailed(+id).subscribe({
      next: (res) => this.order.set(res),
    });
  }
}
