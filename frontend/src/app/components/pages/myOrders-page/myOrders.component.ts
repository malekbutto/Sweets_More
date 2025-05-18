import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/Users';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders-page',
  templateUrl: './myOrders.component.html',
  styleUrls: ['./myOrders.component.css'],
})
export class myOrdersComponent implements OnInit {
  filteredOrders: Order[] = [];
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}
  // let ordersObservable: Observable<Order[]>;
  // activatedRoute.params.subscribe(() => {
  //   ordersObservable = this.userService.getAllOrders();

  //   ordersObservable.subscribe((serverOrders) => {
  //     this.orders = serverOrders;
  //   });
  // });

  ngOnInit(): void {
    const username = this.userService.currentUser.name;
    this.orderService.getOrdersByUser(username).subscribe((orders) => {
      this.filteredOrders = orders;
    });
  }

  onSort(field: keyof Order) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.filteredOrders.sort((a, b) => {
      let valueA = a[field] ?? '';
      let valueB = b[field] ?? '';

      if (field === 'createdAt') {
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
