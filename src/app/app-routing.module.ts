import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckLoginGuard } from './auth/guards/check-login.guard';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',loadChildren: () =>import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  { 
    path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [CheckLoginGuard] 
  },

  { path: 'product', loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule) },

 
  
   { path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
