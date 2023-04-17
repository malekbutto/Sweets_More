import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { FOODS_BY_ID_URL, FOODS_BY_TAG_URL } from 'src/app/shared/constants/urls';
import { IEditProduct } from 'src/app/shared/interfaces/IEditProduct';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  editProductForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  categories = ['Sweets', 'Pastries', 'Our Cuisine'];
  foods: Food[] = [];
  products!: Food;

  constructor(
    private http:HttpClient,
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.editProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(3)]],
      tags: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      piece: ['', [Validators.required]],
      imageUrl: ['',],
    }
  );

  this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
}

get fc() {
  return this.editProductForm.controls;
}

getFoodByTag(tag: string): Observable<Food[]>{
  this.foodService.getFoodByTag(tag).subscribe(serverTags => {
    this.foods = serverTags;
  });
  return this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
}

getFoodById(id: string): Observable<Food[]>{
  this.foodService.getFoodById(id).subscribe(serverTags => {
    this.products = serverTags;
  });
  return this.http.get<Food[]>(FOODS_BY_ID_URL + id);
}

submit() {
  this.isSubmitted = true;
  if (this.editProductForm.invalid)
    return;

  const fv = this.editProductForm.value;
  const product: IEditProduct = {
    name: fv.name,
    price: fv.price,
    tags: fv.category,
    description: fv.description,
    piece: fv.piece,
    imageUrl: fv.imageUrl,
  };

  this.foodService.editProduct(product).subscribe((_) => {
    this.router.navigateByUrl(this.returnUrl);
  });
}

}
