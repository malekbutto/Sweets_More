import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-all-orders-page',
  templateUrl: './all-orders-page.component.html',
  styleUrls: ['./all-orders-page.component.css']
})
export class AllOrdersPageComponent implements OnInit {
  // @Input()
  // users!:User[];
  orders: Order[] = [];
  constructor(private userService: OrderService, activatedRoute: ActivatedRoute) {
    let ordersObservable: Observable<Order[]>;
    activatedRoute.params.subscribe(() => {
        ordersObservable = this.userService.getAllOrders();

        ordersObservable.subscribe((serverOrders) => {
          this.orders = serverOrders;
        })
      });
  }

  ngOnInit(): void {}
}
