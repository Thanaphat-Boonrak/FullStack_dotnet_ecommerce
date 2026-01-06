import { Directive, effect, inject, TemplateRef, ViewContainerRef, type OnInit } from '@angular/core';
import { AccountService } from '../../core/services/account.service';

@Directive({
  selector: '[appIsAdmin]',
})
export class IsAdmin {
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
   private hasView = false;

  constructor() {
    effect(() => {
      if (this.accountService.isAdmin()) {
        if (!this.hasView) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      } else {
        this.viewContainerRef.clear();
        this.hasView = false;
      }
    });
  }
  
}
