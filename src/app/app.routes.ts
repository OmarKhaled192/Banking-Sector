import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layout/navbar/navbar.component').then(m => m.NavbarComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/customers/pages/customer-list/customer-list.component').then(m => m.CustomerListComponent)
      },
      {
        path: 'customer/:cif',
        loadComponent: () => import('./features/customers/pages/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent)
      },
      {
        path: 'customer/:cif/account/:accountId',
        loadComponent: () => import('./features/transactions/pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
