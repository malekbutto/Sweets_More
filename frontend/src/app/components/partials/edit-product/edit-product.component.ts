import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { IEditProduct } from 'src/app/shared/interfaces/IEditProduct';

@Component({
  selector: 'edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  editProduct!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editProduct = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(3)]],
      tags: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      favorite: ['', [Validators.required]],
      stars: ['', [Validators.required, Validators.maxLength(1)]],
      piece: ['', [Validators.required]],
      imageUrl: ['',],
    }
  );

  this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
}

get fc() {
  return this.editProduct.controls;
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
    favorite: fv.favorite,
    stars: fv.stars,
    piece: fv.piece,
    imageUrl: fv.imageUrl,
  };

  this.foodService.editProduct(product).subscribe((_) => {
    this.router.navigateByUrl(this.returnUrl);
  });
}

}
