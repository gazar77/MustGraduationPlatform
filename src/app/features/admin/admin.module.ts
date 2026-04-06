import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { ManagementTableComponent } from './components/management-table/management-table.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminLayoutComponent } from '../../core/layouts/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserListComponent,
    ManagementTableComponent,
    AdminManagementComponent,
    AdminSettingsComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
    AdminNavbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
