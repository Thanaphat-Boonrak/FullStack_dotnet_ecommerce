import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import type { Order, OrderToCreate } from '../../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.baseAPI;
  private http = inject(HttpClient);
  orderComplete = signal<boolean>(false)

  createOrder(orderToCreate: OrderToCreate) {
    return this.http.post<Order>(this.baseUrl + 'orders',  orderToCreate );
  }

  getOrderUser() {
    return this.http.get<Order[]>(this.baseUrl + 'orders');
  }

  getOrderDetailed(id: number) {
    return this.http.get<Order>(this.baseUrl + 'orders/' + id);
  }
}
