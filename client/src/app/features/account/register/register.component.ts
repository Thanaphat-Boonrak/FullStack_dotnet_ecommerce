import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from "../../../shared/components/text-input/text-input.component";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatButton, MatCard, TextInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  protected validationError = signal<string[] | null>(null)
  registerForm = this.fb.group({
    firstName: ['',Validators.required],
    lastName: ['',Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password: ['',Validators.required],
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.snack.success('Registration success');
        this.router.navigateByUrl('/account/login');
      },
      error: (errors) => {
        this.validationError.set(errors);
      },
    });
  }
}
