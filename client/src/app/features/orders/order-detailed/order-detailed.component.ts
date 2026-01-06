import { Component, inject, signal, type OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { Order } from '../../../shared/models/order';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AddressPipe } from '../../../shared/pipes/address-pipe';
import { CardPipe } from '../../../shared/pipes/card-pipe';
import { AccountService } from '../../../core/services/account.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-order-detailed',
  imports: [MatCardModule, MatButton, DatePipe, CurrencyPipe, AddressPipe, CardPipe],
  templateUrl: './order-detailed.component.html',
  styleUrl: './order-detailed.component.scss',
})
export class OrderDetailedComponent implements OnInit {
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService)
  private router = inject(Router)
  private adminService = inject(AdminService)
  protected order = signal<Order | null>(null);
  buttonText = this.accountService.isAdmin() ? 'Return to admin' : 'Return to order'

  onReturnClick(){
    this.accountService.isAdmin() ? this.router.navigateByUrl('/admin') : this.router.navigateByUrl('/orders')
  }

    ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    const loadOrderData = this.accountService.isAdmin()? this.adminService.getOrder(+id) : this.orderService.getOrderDetailed(+id)
    loadOrderData.subscribe({
      next: (res) => this.order.set(res),
    });
  }
}
