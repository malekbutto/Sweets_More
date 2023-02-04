import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart:Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor(private toastrService:ToastrService) { }

  addToCart(food:Food):void{
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if (cartItem){
      this.toastrService.error(`${food.name} already in cart`)
      return;
    }
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
    this.toastrService.success(`${food.name} added to cart`,'')
  }

  removeFromCart(foodId:string,foodName:string): void{
    this.cart.items = this.cart.items.filter(item => item.food.id != foodId);
    this.setCartToLocalStorage();
    this.toastrService.success(`${foodName} removed from cart`,'')
  }

  changeQuantity(foodId:string, quantity:number){
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if (!cartItem)
      return;

    cartItem.quantity += quantity;
    cartItem.price = cartItem.quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  clearCart():void{
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable():Observable<Cart>{
    return this.cartSubject.asObservable();
  }

  getCart(): Cart{
    return this.cartSubject.value;
  }

  private setCartToLocalStorage():void{
    this.cart.totalPrice = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage():Cart{
    const cartJson = localStorage.getItem('Cart');
    return cartJson? JSON.parse(cartJson): new Cart();
  }

}
