import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProposalFormComponent } from './proposal-form/proposal-form.component';
import { ProjectRegistrationComponent } from './project-registration/project-registration.component';
import { SharedModule } from '../../shared/shared.module';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

const routes: Routes = [
  { path: 'proposal', component: ProposalFormComponent },
  { path: 'project-registration-1', component: ProjectRegistrationComponent, data: { type: 'reg1' } },
  { path: 'project-registration-2', component: ProjectRegistrationComponent, data: { type: 'reg2' } }
];

@NgModule({
  declarations: [
    ProposalFormComponent,
    ProjectRegistrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    HeroBannerComponent
  ]
})
export class SubmissionModule { }
