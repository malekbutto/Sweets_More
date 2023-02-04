import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { IAddProduct } from 'src/app/shared/interfaces/IAddProduct';

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  addProduct!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProduct = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(3)]],
      tags: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      favorite: ['', [Validators.required]],
      stars: ['', [Validators.required, Validators.maxLength(1)]],
      piece: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    }
  );

  this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
}

get fc() {
  return this.addProduct.controls;
}

submit() {
  this.isSubmitted = true;
  if (this.addProduct.invalid)
    return;

  const fv = this.addProduct.value;
  const product: IAddProduct = {
    name: fv.name,
    price: fv.price,
    tags: fv.category,
    description: fv.description,
    favorite: fv.favorite,
    stars: fv.stars,
    piece: fv.piece,
    imageUrl: fv.imageUrl,
  };

  this.foodService.addProduct(product).subscribe((_) => {
    this.router.navigateByUrl(this.returnUrl);
  });
}

}
