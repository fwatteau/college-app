import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { OnlyLoggedInUsersGuard } from '../guard/only-logged-guard';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent, canActivate: [OnlyLoggedInUsersGuard] },
  { path: 'home',  component: HomeComponent, canActivate: [OnlyLoggedInUsersGuard]},
 // { path: 'detail', loadChildren: './+detail#DetailModule', canActivate: [AlwaysAuthGuard]},
  { path: 'login',  component: LoginComponent },
  /* *{ path: 'about', component: AboutComponent },
  ,
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent }, */
];
