import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USERS_URL, USER_LOGIN_URL, USER_REGISTER_URL, USER_UPDATE_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/Users';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;

  constructor(private http:HttpClient, private toastrService:ToastrService, private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }

  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(USERS_URL);
  }

  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to Sweet & More, ${user.name}`,
          'Login successful')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed!');
        }
      })
    );
  }

  register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to Sweet & More,${user.name}`,
          'Register Successful')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed!');
        }
      })
    )
  }

  updateUser(userUpdate:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_UPDATE_URL, userUpdate).pipe(
      tap({
        next: (user) => {
          alert("updated");
          this.userSubject.next(user);
          this.toastrService.success(`Details Updated Successfully, ${user.name}`,
          'Update Successful')
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Update Failed!');
        }
      })
    )
  }

  // deleteUser(userDelete:IUserRegister): void{
  //   return this.http.delete(USER_DELETE_URL, userDelete).pipe(
  //     tap({
  //       next: (user) => {
  //         alert("updated");
  //         this.userSubject.next(user);
  //         this.toastrService.success(`Details Updated Successfully, ${user.name}`,
  //         'Update Successful')
  //       },
  //       error: (errorResponse) => {
  //         this.toastrService.error(errorResponse.error, 'Update Failed!');
  //       }
  //     })
  //   )
  // }

  logout(){
    this.router.navigateByUrl("/home");
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson)
      return JSON.parse(userJson) as User;

    return new User;
  }
}
