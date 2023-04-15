import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ORDERS_URL, ORDER_CREATE_URL } from '../shared/constants/urls';
import { Order } from '../shared/models/Order';
import { IOrder } from '../shared/interfaces/IOrder';
import { Router } from '@angular/router';

const ORDER_KEY = 'Order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderSubject = new BehaviorSubject<Order>(this.getOrderFromLocalStorage());
  public orderObservable:Observable<Order>;

  constructor(private http:HttpClient, private toastrService:ToastrService, private router: Router) {
    this.orderObservable = this.orderSubject.asObservable();
  }

  getAllOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(ORDERS_URL);
  }

  saveOrderToMongoDB(saveOrder:Order): Observable<Order>{
    return this.http.post<Order>(ORDER_CREATE_URL, saveOrder).pipe(
      tap({
        next: (order) => {
          this.setOrderToLocalStorage(order);
          this.orderSubject.next(order);
          this.toastrService.success(`Order placed successfully`,
          'Saved');
          localStorage.removeItem('Order');
          localStorage.removeItem('Cart');
          window.location.reload();
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Purchase failed!');
        }
      })
    )
  }

  public setOrderToLocalStorage(order:Order){
    const orderJson = JSON.stringify(order);
    localStorage.setItem(ORDER_KEY, orderJson);
  }

  private getOrderFromLocalStorage():Order{
    const userJson = localStorage.getItem(ORDER_KEY);
    if (userJson)
      return JSON.parse(userJson) as Order;

    return new Order;
  }
}
