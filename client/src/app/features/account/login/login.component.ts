import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';

@Component({
  selector: 'app-login',
  imports: [TextInputComponent, MatCard,ReactiveFormsModule,MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute)
  returnUrl = '/shop'

  constructor(){    
    const url = this.activateRoute.snapshot.queryParams['returnUrl'];
    if(url) this.returnUrl = url
  }

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next: () => {
        this.accountService.getUserInfo().subscribe()
        this.router.navigateByUrl(this.returnUrl);
      },
    });
  }
}
