import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { FOODS_BY_TAG_URL } from 'src/app/shared/constants/urls';
import { IEditProduct } from 'src/app/shared/interfaces/IEditProduct';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  editProduct!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  category = ['Sweets', 'Pastries', 'Our Cuisine'];
  foods: Food[] = [];

  constructor(
    private http:HttpClient,
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    let foodsObservable: Observable<Food[]>;
    // activatedRoute.params.subscribe((params) => {
    //   if (params.tag)
    //     foodsObservable = this.foodService.getFoodByTag(params.tag);

    //     foodsObservable.subscribe((serverFoods) => {
    //       this.foods = serverFoods;
    //     })
    //   });

    // this.foods = this.getFoodByTag(tag:String);
  }

  ngOnInit(): void {
    this.editProduct = this.formBuilder.group({
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
  return this.editProduct.controls;
}

getFoodByTag(tag: string): Observable<Food[]>{
  return this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
}

submit() {
  this.isSubmitted = true;
  if (this.editProduct.invalid)
    return;

  const fv = this.editProduct.value;
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
