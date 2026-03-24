import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { IdeasRoutingModule } from './ideas-routing.module';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { IdeaListComponent } from './idea-list/idea-list.component';
import { IdeaCardComponent } from './idea-card/idea-card.component';
import { IdeaDetailComponent } from './idea-detail/idea-detail.component';
import { IdeaRegisterComponent } from './idea-register/idea-register.component';

@NgModule({
  declarations: [
    IdeaListComponent,
    IdeaCardComponent,
    IdeaDetailComponent,
    IdeaRegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IdeasRoutingModule,
    HeroBannerComponent
  ]
})
export class IdeasModule { }
