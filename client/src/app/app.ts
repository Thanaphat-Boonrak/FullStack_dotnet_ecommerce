import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { RouterOutlet } from '@angular/router';
import { BusyService } from './core/services/busy.service';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected busyService = inject(BusyService)
  protected readonly title = signal('client');
}
