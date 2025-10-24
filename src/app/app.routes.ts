import { Routes } from '@angular/router';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserDetailComponent } from './features/users/user-detail/user-detail.component';
import { CompanyListComponent } from './features/companies/company-list/company-list.component';
import { CompanyDetailComponent } from './features/companies/company-detail/company-detail.component';
import { ApprovalListComponent } from './features/approvals/approval-list/approval-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Protected routes
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [authGuard] },
  { path: 'companies', component: CompanyListComponent, canActivate: [authGuard] },
  { path: 'companies/:id', component: CompanyDetailComponent, canActivate: [authGuard] },
  { path: 'approvals', component: ApprovalListComponent, canActivate: [authGuard] },

  // Wildcard route
  { path: '**', redirectTo: '/login' }
];
