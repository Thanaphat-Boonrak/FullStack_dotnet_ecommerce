import type { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import type { errorResponse } from '../../models/error';

@Component({
  selector: 'app-server-error',
  imports: [MatCard],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
    error?: errorResponse
    private router = inject(Router)
    constructor(){
        const navigation = this.router.currentNavigation()
        this.error = navigation?.extras.state?.['error']
    }
}
