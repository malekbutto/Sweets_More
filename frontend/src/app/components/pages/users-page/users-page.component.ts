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
  users: User[] = [];
  constructor(
    private userService: UserService,
    activatedRoute: ActivatedRoute,
    private toastrService:ToastrService,
    // private dialogService: DialogService
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

  openDialog():void {

    this.toastrService.success(`Details updated successfully`,'')
  }

  updateUser():void {
    this.disableValue = true;
    this.toastrService.success(`Details updated successfully`,'')
  }

  enableEdit():void {
    this.disableValue = false;
  }

  deleteUser(user:User):void {
    alert("Deleted");
    // this.dialogService.openConfirmDialog('Are your sure to delete this user?')
    // .afterClosed().subscribe((res: boolean) => {
    //   if (res){
    //     // this.userService.deleteUser(user);
    //     this.toastrService.success(`User deleted successfully`,'')
    //   }

    // });
  }
}
