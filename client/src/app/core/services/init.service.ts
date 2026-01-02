import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { of,  forkJoin, tap } from 'rxjs';
import { AccountService } from './account.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService)
  private signalRService = inject(SignalrService)
    init(){
      const cartId = localStorage.getItem('cart_id')
      return forkJoin({
        cart: cartId ? this.cartService.getCart(cartId) : of(null),
        user:this.accountService.getUserInfo().pipe(
          tap((user) =>{
            if(user) this.signalRService.createHubConnection()
          } )
        )
      })
    }
}
