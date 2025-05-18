import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { IOrder } from 'src/app/shared/interfaces/IOrder';
import { CartItem } from 'src/app/shared/models/CartItem';
import { Order } from 'src/app/shared/models/Order';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css'],
})
export class CheckoutPageComponent implements OnInit {
  order: Order = new Order();
  checkoutForm!: FormGroup;
  returnUrl: any;
  activatedRoute: any;

  constructor(
    cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router: Router,
    private locationService: LocationService
  ) {
    const cart = cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }
  ngOnInit(): void {
    let { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],
    });
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  onLocationSelected(coords: { lat: number; lng: number }) {
    this.locationService
      .getAddressFromCoordinates(coords.lat, coords.lng)
      .subscribe({
        next: (res) => {
          const address =
            res.display_name ||
            `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;
          this.checkoutForm.get('address')?.setValue(address);
        },
        error: () => {
          this.checkoutForm
            .get('address')
            ?.setValue(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
        },
      });
  }

  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }

    if (!this.order.addressLatLng) {
      this.toastrService.warning(
        'Please select your location on the map',
        'Location'
      );
      return;
    }

    this.order.id = crypto.randomUUID();
    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;
    this.order.createdAt = String(Date.now());

    this.orderService.saveOrderToMongoDB(this.order).subscribe({
      next: () => {
        // this.order.items = [];
        this.router.navigateByUrl('/');
      },
    });
  }

  navigateToAddress(event: Event) {
    event.preventDefault();
    const address = this.checkoutForm.get('address')?.value;

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
