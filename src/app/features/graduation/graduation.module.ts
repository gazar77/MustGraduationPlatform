import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { GraduationRoutingModule } from './graduation-routing.module';
import { GraduationFormComponent } from './graduation-form/graduation-form.component';
import { ProposalSubmissionComponent } from './proposal-submission/proposal-submission.component';
import { GraduationRequirementsComponent } from './requirements/requirements.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@NgModule({
  declarations: [
    GraduationFormComponent,
    ProposalSubmissionComponent,
    GraduationRequirementsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraduationRoutingModule,
    HeroBannerComponent
  ]
})
export class GraduationModule { }
