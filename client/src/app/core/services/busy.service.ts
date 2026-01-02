import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  loading = signal(false);
  busyRequestCount = signal(0);

  busy() {
    this.busyRequestCount.update((current) => current + 1)
    this.loading.set(true)    
  }

  idle(){
        console.log(this.busyRequestCount());
    this.busyRequestCount.update((current) => Math.max(0,current - 1))
    this.loading.set(false)
  }
}
