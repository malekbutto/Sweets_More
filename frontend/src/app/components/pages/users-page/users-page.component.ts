import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, window } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/Users';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  disableValue = true;
  users: User[] = [];
  constructor(
    private userService: UserService,
    activatedRoute: ActivatedRoute
  ) {
    let usersObservable: Observable<User[]>;
    activatedRoute.params.subscribe(() => {
      usersObservable = this.userService.getAllUsers();

      usersObservable.subscribe((serverUsers) => {
        this.users = serverUsers;
      });
    });
  }

  ngOnInit(): void {}

  enableEdit():void {
    this.disableValue = false;
  }
}
