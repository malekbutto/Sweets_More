import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        // userName: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', [Validators.required]],
        // phone: [
        //   '',
        //   [
        //     Validators.required,
        //     Validators.maxLength(10),
        //     Validators.minLength(7),
        //   ],
        // ],
        address: ['', [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: PasswordsMatchValidator('password', 'confirmPassword'),
      }
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid)
      return;

    const fv = this.registerForm.value;
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      // userName: fv.userName,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      // phone: fv.phone,
      address: fv.address,
    };

    this.userService.register(user).subscribe((_) => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
