import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import type { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private baseUrl = environment.baseAPI;
  private http = inject(HttpClient);
  deliveryMethods: DeliveryMethod[] = [];

  getDeliveryMethod() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payments/delivery-methods').pipe(
      map(methods => {
        this.deliveryMethods = methods.sort((a,b) => b.price - a.price)
        return methods
      })
    );
  }
}
