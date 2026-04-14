import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialsPageComponent } from './tutorials-page.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-tutorials-all-page',
  standalone: true,
  imports: [CommonModule, TutorialsPageComponent, HeroBannerComponent],
  template: `
    <app-hero-banner></app-hero-banner>
    <app-tutorials-page [viewAll]="true"></app-tutorials-page>
  `
})
export class TutorialsAllPageComponent {}
