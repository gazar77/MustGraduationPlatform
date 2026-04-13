import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { UserLayoutComponent } from './core/layouts/user-layout/user-layout.component';
import { ComingSoonComponent } from './shared/components/coming-soon/coming-soon.component';
import { TutorialsPageComponent } from './features/tutorials/tutorials-page.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: UserLayoutComponent,
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
        path: 'resources/tutorials',
        component: TutorialsPageComponent
      },
      {
        path: 'doctor',
        loadChildren: () => import('./features/doctor/doctor.module').then(m => m.DoctorModule),
        canActivate: [AuthGuard],
        data: { roles: ['Admin', 'SuperAdmin'] }
      },
      {
        path: 'contact',
        loadChildren: () => import('./features/contact/contact.module').then(m => m.ContactModule)
      },
      {
        path: 'submission',
        loadChildren: () => import('./features/submission/submission.module').then(m => m.SubmissionModule)
      },
      
      // ==========================================
      // MEGA MENU ROUTES (Mapped to Coming Soon)
      // ==========================================

      // 1. The University
      {
        path: 'the-university',
        children: [
          { path: 'about-must/board-of-trustees', component: ComingSoonComponent },
          { path: 'about-must/president', component: ComingSoonComponent },
          { path: 'about-must/vision-mission', component: ComingSoonComponent },
          { path: 'about-must/must-values-principles', component: ComingSoonComponent },
          { path: 'about-must/history', component: ComingSoonComponent },
          
          { path: 'sectors/environmental-and-community-service-sector', component: ComingSoonComponent },
          { path: 'sectors/environmental-and-community-service-sector/innovation-and-entrepreneurship-center', component: ComingSoonComponent },
          { path: 'sectors/environmental-and-community-service-sector/arab-heritage-authentication-center', component: ComingSoonComponent },
          { path: 'sectors/environmental-and-community-service-sector/equal-opportunities-gender-equality-unit', component: ComingSoonComponent },
          { path: 'sectors/sustainability-sector', component: ComingSoonComponent },
          
          { path: 'reports/interdisciplinary-subjects', component: ComingSoonComponent },
          { path: 'reports/financial-report', component: ComingSoonComponent },
          
          { path: 'policies', component: ComingSoonComponent },
          { path: 'university-council-minutes', component: ComingSoonComponent },
          { path: 'quality-assurance-and-accreditation-sector', component: ComingSoonComponent },
          { path: 'accreditation-partnerships', component: ComingSoonComponent },
          { path: 'contact-us', component: ComingSoonComponent },
          
          { path: 'resources/smart-e-learning', component: ComingSoonComponent },
          { path: 'resources/muster', component: ComingSoonComponent },
          { path: 'resources/mdar', component: ComingSoonComponent }
        ]
      },

      // 2. Academics
      {
        path: 'academics',
        children: [
          { path: 'undergraduate-studies', component: ComingSoonComponent },
          { path: 'post-graduate-program', component: ComingSoonComponent },
          { path: 'academic-calendar', component: ComingSoonComponent },
          { path: 'international-students-affairs-sector', component: ComingSoonComponent }
        ]
      },

      // 3. Admission
      { path: 'admission', component: ComingSoonComponent },

      // 4. MUST BUZZ
      {
        path: 'must-buzz',
        children: [
          { path: 'events', component: ComingSoonComponent },
          { path: 'news', component: ComingSoonComponent },
          { path: 'blogs', component: ComingSoonComponent },
          { path: 'announcements', component: ComingSoonComponent }
        ]
      },

      // 5. Centers
      {
        path: 'centers',
        children: [
          { path: 'main-centers', component: ComingSoonComponent },
          { path: 'units', component: ComingSoonComponent },
          { path: 'research-center-for-public-opinion-and-societal-issues-monitoring', component: ComingSoonComponent }
        ]
      },

      // 6. Life at MUST
      {
        path: 'life-at-must',
        children: [
          { path: 'must-life', component: ComingSoonComponent },
          { path: 'must-stars', component: ComingSoonComponent },
          { path: 'must-clubs', component: ComingSoonComponent },
          { path: 'facilities', component: ComingSoonComponent }
        ]
      },

      // 7. SDGs
      { path: 'sdgs', component: ComingSoonComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'SuperAdmin'] }
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
