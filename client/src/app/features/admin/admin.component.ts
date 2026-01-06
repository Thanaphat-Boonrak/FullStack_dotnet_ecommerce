import {
  Component,
  inject,
  signal,
  ViewChild,
  type AfterViewInit,
  type OnInit,
} from '@angular/core';
import { MatPaginator, type PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminService } from '../../core/services/admin.service';
import { OrderParams } from '../../shared/models/orderParams';
import type { Order } from '../../shared/models/order';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatLabel, MatSelectModule, type MatSelectChange } from '@angular/material/select';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule} from '@angular/material/tabs';
import { RouterLink } from "@angular/router";
import { DialogService } from '../../core/services/core/services/dialog.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIcon, MatSelectModule, DatePipe, CurrencyPipe, MatLabel, MatTooltipModule, MatTabsModule, MatIconButton, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'buyerEmail', 'orderDate','total', 'status', 'action'];

  dataSource = new MatTableDataSource<Order>([]);
  private adminService = inject(AdminService);
  private dialogService = inject(DialogService)

  orderParams = signal(new OrderParams());
  totalItem = 0;

  statusOption = ['All', 'PaymentReceived', 'PaymentMismatch', 'Refunded', 'Pending'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadOrders() {
    this.adminService.getOrders(this.orderParams()).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.totalItem = res.count;
      },
    });
  }

  async openConfirmDialog(id: number){
  const confirmed = await this.dialogService.confirm('Confirm refund' ,'Are you sure you want to refun? This cannot be undone')
  if (confirmed) this.refundOrder(id)
  }

  onPageChange(event: PageEvent) {
    this.orderParams.update((p) => ({
      ...p,
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,
    }));
    this.loadOrders();
  }

  onFilterSelect(event: MatSelectChange) {
    this.orderParams.update((p) => ({
      ...p,
      filter: event.value,
      pageNumber: 1,
    }));
    this.loadOrders();
  }

  refundOrder(id:number){
    this.adminService.refundOrderId(id).subscribe({
      next: order => {
        this.dataSource.data = this.dataSource.data.map(o => o.id === id ? order : o)
      }
    })
  }
}
