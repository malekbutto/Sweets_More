import { Injectable } from '@angular/core';
import { foods } from 'src/data';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAll():Food[]{
    return foods;
  }

  getAllProductsBySearchTerm(searchTerm: string): Food[]{
    return this.getAll().filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  getProductById(id: number): Food{
    return this.getAll().find(food => food.id == id) ?? new Food();
  }

}
