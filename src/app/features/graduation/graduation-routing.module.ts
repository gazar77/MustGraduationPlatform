import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { GraduationFormComponent } from './graduation-form/graduation-form.component';
import { ProposalSubmissionComponent } from './proposal-submission/proposal-submission.component';
import { GraduationRequirementsComponent } from './requirements/requirements.component';

const routes: Routes = [
  { path: '', component: GraduationFormComponent, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  { path: 'proposal', component: ProposalSubmissionComponent, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  { path: 'requirements-1', component: GraduationRequirementsComponent, canActivate: [AuthGuard], data: { roles: ['Student'], number: '1' } },
  { path: 'requirements-2', component: GraduationRequirementsComponent, canActivate: [AuthGuard], data: { roles: ['Student'], number: '2' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraduationRoutingModule { }
