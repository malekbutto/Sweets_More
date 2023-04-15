import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { IAddProduct } from 'src/app/shared/interfaces/IAddProduct';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  product: Food = new Food();
  addProductForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      tags: ['', [Validators.required]],
      description: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      piece: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.addProductForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.addProductForm.invalid) return;

    this.product.id = crypto.randomUUID();
    this.product.name = this.fc.name.value,
    this.product.price = parseInt(this.fc.price.value),
    this.product.tags = this.fc.tags.value,
    this.product.description = this.fc.description.value,
    this.product.piece = this.fc.piece.value,
    this.product.imageUrl = this.fc.imageUrl.value;

    console.log(this.product);

    this.foodService.addProduct(this.product).subscribe({
      next: () => {
        // this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
}
