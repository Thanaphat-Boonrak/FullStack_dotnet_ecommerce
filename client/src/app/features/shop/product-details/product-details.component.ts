import { Component, inject, signal, type OnInit } from '@angular/core';
import { ShopsService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import type { Product } from '../../../shared/models/product';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, MatIcon, MatAnchor, MatFormField, MatInput, MatLabel, MatDivider,FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopsService);
  private activatedRoute = inject(ActivatedRoute);
  protected product = signal<Product | null>(null);
  private cartService = inject(CartService)
  quantityInCart = 0;
  quantity = 1;
  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) return;
    this.shopService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res)
        this.updateQuantityIncart()
      },
      error: (err) => console.error(err),
    });
  }


  updateCart(){
    if(!this.product()) return;
    if(this.quantity > this.quantityInCart){
      const itemToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemToAdd
      this.cartService.addItemToCart(this.product()!,itemToAdd)
    }else{
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove
      this.cartService.removeItemFromCart(this.product()!.id,itemsToRemove)
    }
  }

  updateQuantityIncart(){
    this.quantityInCart = this.cartService.cart()?.items.find(item => item.productId === this.product()?.id)?.quantity || 0
    this.quantity = this.quantityInCart || 1
  }

  getButtontext(){
    return this.quantityInCart > 0 ? 'Update Cart' : 'Add to cart'
  }

}
