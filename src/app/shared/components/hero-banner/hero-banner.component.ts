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

  constructor(public langService: LanguageService) {}
  
  @Input() bgImages: string[] = [
    'assets/17214025351722283902.jpg',
    'assets/202407291119561956.webp',
    'assets/your-background-image.jpg'
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
