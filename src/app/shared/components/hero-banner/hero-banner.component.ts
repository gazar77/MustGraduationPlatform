import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeroBannerComponent implements OnInit {
  @Input() title: string | null = null;
  @Input() breadcrumbs: { label: string, url?: string }[] | null = null;
  @Input() compact: boolean = false;

  // Actual project parts for constant access
  @Input() quickLinks: { labelKey: string, url: string }[] = [
    { labelKey: 'home', url: '/dashboard' },
    { labelKey: 'ideas', url: '/ideas/list' },
    { labelKey: 'register', url: '/ideas/register' },
    { labelKey: 'submitProposal', url: '/submission/proposal' },
    { labelKey: 'req1', url: '/submission/project-registration-1' },
    { labelKey: 'req2', url: '/submission/project-registration-2' },
    { labelKey: 'templates', url: '/templates' },
    { labelKey: 'news', url: '/news/list' },
    { labelKey: 'events', url: '/events/calendar' },
    { labelKey: 'contact', url: '/contact' }
  ];

  constructor(public langService: LanguageService) {}
  
  @Input() bgImages: string[] = [
    '/assets/h1.jpeg',
    '/assets/h2.jpeg',
    '/assets/h3.jpeg',
    '/assets/h4.jpeg',
    '/assets/h5.jpeg',
    '/assets/h6.jpeg',
    '/assets/h7.jpeg',
    '/assets/h8.jpeg'
  ];

  currentSlideIndex = 0;

  ngOnInit() {
    this.startSlider();
  }

  startSlider() {
    setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.bgImages.length;
    }, 5000);
  }

  get currentBgImage(): string {
    return this.bgImages[this.currentSlideIndex];
  }
}
