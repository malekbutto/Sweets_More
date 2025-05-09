import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/shared/models/Cart';
import { CartItem } from 'src/app/shared/models/CartItem';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  foodQuantity: number = 1;
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit(): void {}

  removeFromCart(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem.food.id, cartItem.food.name);
  }

  changeQuantity(cartItem: CartItem, quantityInString: string) {
    const amount = parseInt(quantityInString, 10);
    const newQuantity = cartItem.quantity + amount;

    this.foodQuantity += amount;
    if (newQuantity < 1) this.removeFromCart(cartItem);
    else {
      this.cartService.changeQuantity(cartItem.food.id, amount);
    }
  }
}
