import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  editUserForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let { name, email, phone, address } = this.userService.currentUser;
    this.editUserForm = this.formBuilder.group(
      {
        name: [name, [Validators.required, Validators.minLength(5)]],
        email: [email, [Validators.required, Validators.email]],
        phone: [phone, [Validators.required, Validators.minLength(9)]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', [Validators.required]],
        address: [address, [Validators.required, Validators.minLength(10)]],
      },
      {
        validators: PasswordsMatchValidator('password', 'confirmPassword'),
      }
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.editUserForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.editUserForm.invalid) return;

    const fv = this.editUserForm.value;
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      phone: fv.phone,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address,
    };

    this.userService.updateUser(user).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
