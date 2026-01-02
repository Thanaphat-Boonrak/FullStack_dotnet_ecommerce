import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Address, User } from '../../shared/models/user';
import { tap } from 'rxjs';
import { StripeService } from './stripe.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = environment.baseAPI;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private signalRService = inject(SignalrService)
  login(values: any) {
    this.signalRService.createHubConnection()
    let params = new HttpParams();
    params = params.append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, { params, withCredentials: true });
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      tap((user) => {
        this.currentUser.set(user);
        return user;
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
      tap(() => {
        this.signalRService.stopConnection()
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if(user) user.address = address
          return user
        })
      })
    );
  }

  getAuthState() {
    return this.http.get<{isAuthenticated:boolean}>(this.baseUrl + 'account');
  }
}
