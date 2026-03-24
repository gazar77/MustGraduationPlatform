import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { AdminLayoutComponent } from '../../core/layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UserListComponent },
      { path: 'manage/news', component: AdminManagementComponent, data: { type: 'news' } },
      { path: 'manage/ideas', component: AdminManagementComponent, data: { type: 'ideas' } },
      { path: 'manage/events', component: AdminManagementComponent, data: { type: 'event' } },
      { path: 'manage/templates', component: AdminManagementComponent, data: { type: 'template' } },
      { path: 'manage/proposals', component: AdminManagementComponent, data: { type: 'proposals' } },
      { path: 'manage/contact', component: AdminManagementComponent, data: { type: 'contact' } },
      { path: 'manage/project1', component: AdminManagementComponent, data: { type: 'project1' } },
      { path: 'manage/project2', component: AdminManagementComponent, data: { type: 'project2' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
