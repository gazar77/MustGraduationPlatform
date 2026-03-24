import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    HeroBannerComponent
  ]
})
export class DashboardModule { }
