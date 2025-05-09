import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Cart } from 'src/app/shared/models/Cart';
import { User } from 'src/app/shared/models/Users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cart!: Cart;
  cartQuantity: number = 0;
  user!: User;
  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    });

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {
    this.cartService.cartObservable.subscribe((cart) => {
      this.cart = cart;
      if (cart?.items) {
        this.cartQuantity = this.cartService.getUniqueItemCount(cart);
      } else {
        this.cartQuantity = 0;
      }
    });
  }

  logout() {
    this.userService.logout();
  }

  get isAuth() {
    return this.user.name;
  }
}
