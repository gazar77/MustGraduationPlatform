import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplateListComponent } from './template-list/template-list.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@NgModule({
  declarations: [
    TemplateListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TemplatesRoutingModule,
    HeroBannerComponent
  ]
})
export class TemplatesModule { }
