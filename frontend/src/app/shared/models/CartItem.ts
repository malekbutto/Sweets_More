import { Food } from "./Food";

export class CartItem{

    constructor(public food:Food) {
    }
    quantity:number = 1;
    price: number = this.food.price;

    // get price():number{
    //     return this.food.price * this.quantity;
    // }
}
