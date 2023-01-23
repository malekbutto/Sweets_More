import { Injectable } from '@angular/core';
import { foods, sample_tags } from 'src/data';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAll():Food[]{
    return foods;
  }

  getAllFoodsBySearchTerm(searchTerm: string): Food[]{
    return this.getAll().filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  getFoodById(id: number): Food{
    return this.getAll().find(food => food.id == id) ?? new Food();
  }

  getAllTags(): Tag[]{
    return sample_tags;
  }

  getFoodByTag(tag: string): Food[]{
    return tag == "All" ?
    this.getAll() :
    this.getAll().filter(food => food.tags?.includes(tag));
  }

}
