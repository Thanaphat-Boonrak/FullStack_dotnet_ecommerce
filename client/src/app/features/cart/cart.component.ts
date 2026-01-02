import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItemsComponent } from "./cart-items/cart-items.component";
import { OrderSummaryComponent } from "../../shared/components/order-summary/order-summary.component";
import { EmptyStateComponent } from "../../shared/components/empty-state/empty-state.component";

@Component({
  selector: 'app-cart',
  imports: [CartItemsComponent, OrderSummaryComponent, EmptyStateComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  protected cartService = inject(CartService)
}
