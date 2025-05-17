import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  public cartObservable = this.cartSubject.asObservable();
  private currentUserId: string = this.getCurrentUserId();

  constructor(private toastrService: ToastrService) {
    this.initializeUser();
  }

  // Initialize or update the current user
  public setCurrentUser(userId: string | null): void {
    if (userId) {
      this.currentUserId = userId;

      this.loadUserCart();
    }
  }

  public getCurrentUserId(): string {
    const userJson = localStorage.getItem('User');
    return userJson ? JSON.parse(userJson).id : '';
  }

  private initializeUser(): void {
    this.currentUserId = this.getCurrentUserId();
  }

  private loadUserCart(): void {
    this.cart = this.getCartFromLocalStorage() || [];
    // this.cartSubject.next(this.cart);
  }

  private setCartToLocalStorage(): void {
    const cartKey = `Cart_${this.currentUserId}`;
    this.cart.totalPrice = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.price,
      0
    );
    this.cart.totalCount = this.cart.items.reduce(
      (prevSum, currentItem) => prevSum + currentItem.quantity,
      0
    );

    localStorage.setItem(cartKey, JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  public getCartFromLocalStorage(): Cart {
    const cartKey = `Cart_${this.currentUserId}`;
    const cartJson = localStorage.getItem(cartKey);
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }

  addToCart(food: Food): void {
    let cartItem = this.cart.items.find((item) => item.food.id === food.id);
    if (cartItem) {
      this.toastrService.error(`${food.name} already in cart`);
      return;
    }
    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
    this.toastrService.success(`${food.name} added to cart`, '');
  }

  removeFromCart(foodId: string, foodName: string): void {
    this.cart.items = this.cart.items.filter((item) => item.food.id != foodId);
    this.setCartToLocalStorage();
    this.toastrService.success(`${foodName} removed from cart`, '');
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find((item) => item.food.id === foodId);
    if (!cartItem) return;

    cartItem.quantity += quantity;
    if (cartItem.quantity < 1) return;
    else cartItem.price = cartItem.quantity * cartItem.food.price;
    this.setCartToLocalStorage();
  }

  updateCartItem(updatedItem: CartItem) {
    const cart = this.getCartFromLocalStorage();
    const itemIndex = cart.items.findIndex(
      (item) => item.food.id === updatedItem.food.id
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = updatedItem.quantity;
    }

    this.setCartToLocalStorage();
  }

  getUniqueItemCount(cart: Cart): number {
    return cart.items.length;
  }

  getTotalCount(cart: Cart): number {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart(): void {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }
}
