import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { FOODS_BY_ID_URL, FOODS_BY_TAG_URL } from 'src/app/shared/constants/urls';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit{

  deleteProductForm!: FormGroup;
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
  ) {}

  ngOnInit(): void {
    this.deleteProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      tags: ['', [Validators.required]],
    }
  );

  this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
}

get fc() {
  return this.deleteProductForm.controls;
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
  if (this.deleteProductForm.invalid)
    return;

  const fv = this.deleteProductForm.value;
  const product = fv.id;

  this.foodService.deleteProduct(product).subscribe((_) => {
    this.router.navigateByUrl(this.returnUrl);
  });
}

}
