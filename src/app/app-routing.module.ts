import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { UserLayoutComponent } from './core/layouts/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'ideas',
        loadChildren: () => import('./features/ideas/ideas.module').then(m => m.IdeasModule)
      },
      {
        path: 'graduation-form',
        loadChildren: () => import('./features/graduation/graduation.module').then(m => m.GraduationModule)
      },
      {
        path: 'news',
        loadChildren: () => import('./features/events-news/events-news.module').then(m => m.EventsNewsModule)
      },
      {
        path: 'events',
        loadChildren: () => import('./features/events-news/events-news.module').then(m => m.EventsNewsModule)
      },
      {
        path: 'templates',
        loadChildren: () => import('./features/templates/templates.module').then(m => m.TemplatesModule)
      },
      {
        path: 'doctor',
        loadChildren: () => import('./features/doctor/doctor.module').then(m => m.DoctorModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'submission',
        loadChildren: () => import('./features/submission/submission.module').then(m => m.SubmissionModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
