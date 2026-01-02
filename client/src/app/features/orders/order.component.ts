import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import type { Order } from '../../shared/models/order';
import { RouterLink } from "@angular/router";
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [RouterLink,DatePipe,CurrencyPipe],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private orderService = inject(OrderService);
  protected orders = signal<Order[]>([]);
  ngOnInit(): void {
    this.orderService.getOrderUser().subscribe({
      next: (order) => this.orders.set(order),
    });
  }
}
