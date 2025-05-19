import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-orders-page',
  templateUrl: './all-orders-page.component.html',
  styleUrls: ['./all-orders-page.component.css'],
})
export class AllOrdersPageComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  uniqueNames: string[] = [];
  selectedName: string = '';
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private orderService: OrderService,
    activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    let ordersObservable: Observable<Order[]>;
    activatedRoute.params.subscribe(() => {
      ordersObservable = this.orderService.getAllOrders();

      ordersObservable.subscribe((serverOrders) => {
        this.allOrders = serverOrders;
      });
    });
  }

  ngOnInit(): void {
    // Fetch orders (example)
    this.orderService.getAllOrders().subscribe((orders) => {
      this.allOrders = orders;
      this.filteredOrders = orders;
      this.uniqueNames = [...new Set(orders.map((o) => o.name))]; // extract unique names
    });
  }

  onFilterChange() {
    if (this.selectedName) {
      this.filteredOrders = this.allOrders.filter(
        (order) => order.name === this.selectedName
      );
    } else {
      this.filteredOrders = this.allOrders;
    }
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

  navigateToAddress(event: Event, currentAddress: string) {
    event.preventDefault();
    const address = currentAddress;

    if (address) {
      // Encode the address for URL
      const encodedAddress = encodeURIComponent(address);
      // Open Google Maps with the address
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        '_blank'
      );
    } else {
      // Show error message if address is empty
      this.toastrService.warning(
        'Please enter an address first',
        'No Address Provided'
      );
    }
  }
}
