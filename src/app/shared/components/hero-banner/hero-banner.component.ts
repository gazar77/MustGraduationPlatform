import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { QuickNavLinksComponent } from '../quick-nav-links/quick-nav-links.component';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, QuickNavLinksComponent]
})
export class HeroBannerComponent implements OnInit {
  @Input() title: string | null = null;
  @Input() breadcrumbs: { label: string, url?: string }[] | null = null;
  @Input() compact: boolean = false;

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

  constructor(public langService: LanguageService) {}

  ngOnInit(): void {
    this.startSlider();
  }

  startSlider(): void {
    setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.bgImages.length;
    }, 5000);
  }

  get currentBgImage(): string {
    return this.bgImages[this.currentSlideIndex];
  }
}
