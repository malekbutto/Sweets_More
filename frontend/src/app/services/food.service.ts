import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { foods, sample_tags } from 'src/data';
import { ADD_FOOD, DELETE_FOOD, EDIT_FOOD, FOODS_BY_ID_URL, FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL } from '../shared/constants/urls';
import { IAddProduct } from '../shared/interfaces/IAddProduct';
import { IEditProduct } from '../shared/interfaces/IEditProduct';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient, private toastrService:ToastrService, private router: Router) { }

  getAll(): Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string){
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getFoodById(id: number): Observable<Food>{
    return this.http.get<Food>(FOODS_BY_ID_URL + id);
  }

  getAllTags(): Observable<Tag[]>{
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getFoodByTag(tag: string): Observable<Food[]>{
    return tag == "All" ?
    this.getAll() :
    this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  addProduct(addProduct:IAddProduct): Observable<Food>{
    return this.http.post<Food>(ADD_FOOD, addProduct).pipe(
      tap({
        next: (product) => {
          this.toastrService.success(`${product.name} Added Successfully`,
          'New Product')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Adding New Product Failed!');
        }
      })
    )
  }

  editProduct(editProduct:IEditProduct): Observable<Food>{
    return this.http.post<Food>(EDIT_FOOD, editProduct).pipe(
      tap({
        next: (product) => {
          this.toastrService.success(`${product.name} Edited Successfully`,
          'Edit Product')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Editing Product Failed!');
        }
      })
    )
  }

  deleteProduct(deleteProduct:string): Observable<Food>{
    return this.http.post<Food>(DELETE_FOOD, deleteProduct).pipe(
      tap({
        next: (product) => {
          this.toastrService.success(`${product.name} deleted Successfully`,
          'Edit Product')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Deleting Product Failed!');
        }
      })
    )
  }

}
