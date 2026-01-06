import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { SnackbarService } from '../services/snackbar.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const accountService = inject(AccountService)
  const snackBarService = inject(SnackbarService)
  if(accountService.isAdmin()){
    return true
  }else{
    router.navigateByUrl("/shop")
    snackBarService.error("Some Thing Went Wrong")
    return false
  }
};
