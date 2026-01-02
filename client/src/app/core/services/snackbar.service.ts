import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  error(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-error'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  success(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-sucess'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
