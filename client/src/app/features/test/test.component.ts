import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatAnchor } from "@angular/material/button";

@Component({
  selector: 'app-test',
  imports: [MatAnchor],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  private baseUrl = environment.baseAPI;
  private httpClient = inject(HttpClient);
  protected validationError = signal<string[]>([])

  get401() {
    return this.httpClient.get(this.baseUrl + 'buggy/unauthorized').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  get400() {
    return this.httpClient.get(this.baseUrl + 'buggy/badrequest').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });;
  }

  get404() {
    return this.httpClient.get(this.baseUrl + 'buggy/notfound').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });;
  }

  get500() {
    return this.httpClient.get(this.baseUrl + 'buggy/internalerror').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });;
  }

  getvalid() {
    return this.httpClient.post(this.baseUrl + 'buggy/validationerror',{}).subscribe({
      next: res => console.log(res),
      error: err => this.validationError.set(err)
    });;
  }
}
