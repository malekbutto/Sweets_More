import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, window } from 'rxjs';
// import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/Users';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  disableValue = true;
  disableRole = true;
  admin = true;
  users: User[] = [];
  sortBy: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(
    private userService: UserService,
    activatedRoute: ActivatedRoute,
    private toastrService: ToastrService // private dialogService: DialogService
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

  openDialog(): void {
    this.toastrService.success(`Role changed successfully`, '');
    this.users.forEach((user) => {
      if (user.isAdmin) {
        user.isAdmin = false;
        this.admin = false;
      } else {
        user.isAdmin = true;
        this.admin = true;
      }
    });
    alert(this.admin);
  }

  updateUser(): void {
    this.disableValue = true;
    this.toastrService.success(`Details updated successfully`, '');
    let { name, email, address, isAdmin } = this.userService.currentUser;
    // console.log(name.value);
    // console.log(email);
    // console.log(address);
    // console.log(isAdmin);
  }

  enableEdit(): void {
    this.disableValue = false;
  }

  changeRole(): void {
    this.disableRole = false;
  }

  deleteUser(user: User): void {
    alert('Deleted');
    // this.dialogService.openConfirmDialog('Are your sure to delete this user?')
    // .afterClosed().subscribe((res: boolean) => {
    //   if (res){
    //     // this.userService.deleteUser(user);
    //     this.toastrService.success(`User deleted successfully`,'')
    //   }

    // });
  }

  onSort(field: keyof User) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }

    this.users.sort((a, b) => {
      let valueA = a[field] ?? '';
      let valueB = b[field] ?? '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
