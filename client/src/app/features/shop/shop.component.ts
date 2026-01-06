import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ShopsService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ShopParams } from '../../shared/models/shopParams';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import type { Pagination } from '../../shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatListOption,
    MatSelectionList,
    MatMenu,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
    MatIconButton,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopsService);
  private dialogService = inject(MatDialog);
  protected products = signal<Pagination<Product> | null>(null);
  protected productIsEmpty = computed(() => this.products()?.data || [])
  sortOption = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-high', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' },
  ];
  protected shopParams = signal<ShopParams>(new ShopParams());
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.initialzedShop();
    console.log(this.products());
    
  }

  constructor() {
  }

  initialzedShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProduct();    
  }

  getProduct() {
    this.shopService.getAllProduct(this.shopParams()).subscribe({
      next: (res) => this.products.set(res),
      error: (e) => console.error(e),
    });
  }

  onSearch() {
    this.shopParams().pageNumber = 1;
    this.getProduct();  
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams().brands,
        selectedTypes: this.shopParams().types,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.shopParams().brands = result.selectedBrands;
          this.shopParams().types = result.selectedTypes;
          this.shopParams().pageNumber = 1;
          this.getProduct();
        }
      },
    });
  }

  onSortChange($event: MatSelectionListChange) {
    const selectedOption = $event.options[0];
    if (selectedOption) {
      this.shopParams().sort = selectedOption.value;
      this.shopParams().pageNumber = 1;
      this.getProduct();
    }
  }

  handlePageEvent($event: PageEvent) {
    this.shopParams().pageNumber = $event.pageIndex + 1;
    this.shopParams().pageSize = $event.pageSize;
    this.getProduct();
  }
}
