import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AllOrdersPageComponent } from './components/pages/all-orders-page/all-orders-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { OrdersPageComponent } from './components/pages/orders-page/orders.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { UsersPageComponent } from './components/pages/users-page/users-page.component';
import { AddProductComponent } from './components/partials/add-product/add-product.component';
import { DeleteProductComponent } from './components/partials/delete-product/delete-product.component';
import { EditProductComponent } from './components/partials/edit-product/edit-product.component';

const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'search/:searchTerm', component:HomeComponent},
  {path:'tag/:tag',component:HomeComponent},
  {path:':tags/:id', component:FoodPageComponent},
  {path:'cart-page', component:CartPageComponent},
  {path:'login', component:LoginPageComponent},
  {path:'register', component:RegisterPageComponent},
  {path:'checkout', component:CheckoutPageComponent, canActivate:[AuthGuard]},
  {path:'myOrders', component:OrdersPageComponent},
  {path:'allOrders', component:AllOrdersPageComponent},
  {path:'profile', component:ProfilePageComponent},
  {path:'addProduct', component:AddProductComponent},
  {path:'editProduct', component:EditProductComponent},
  {path:'deleteProduct', component:DeleteProductComponent},
  {path:'users', component:UsersPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
