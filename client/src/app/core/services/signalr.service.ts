import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import type { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  hubUrl = environment.baseHub;
  hubConnection?: HubConnection;
  order = signal<Order | null>(null);
  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((e) => console.log(e));

    this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
      this.order.set(order);
    });
  }

  stopConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection?.stop().catch((err:any) => console.log(err));
    }
  }
}
  