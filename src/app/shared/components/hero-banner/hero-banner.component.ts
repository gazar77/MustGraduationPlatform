import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { HERO_BANNER_BG_IMAGES_KEY } from '../../../core/constants/hero-banner-settings';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';
import { QuickNavLinksComponent } from '../quick-nav-links/quick-nav-links.component';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, QuickNavLinksComponent]
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  @Input() breadcrumbs: { label: string; url?: string }[] | null = null;
  @Input() compact: boolean = false;

  /** When set to a non-empty array, skips API and uses these paths only. */
  @Input() bgImages: string[] | null = null;

  /** Resolved paths from input override or API (server-driven only). */
  displayImages: string[] = [];

  currentSlideIndex = 0;
  private slideIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    public langService: LanguageService,
    private siteSettingsService: SiteSettingsService
  ) {}

  ngOnInit(): void {
    if (this.bgImages && this.bgImages.length > 0) {
      this.displayImages = HeroBannerComponent.normalizeImagePaths(this.bgImages);
      this.startSlider();
      return;
    }

    this.siteSettingsService.getSetting(HERO_BANNER_BG_IMAGES_KEY).subscribe({
      next: (res) => {
        const raw = this.siteSettingsService.parseStoredValue(res.value);
        try {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed) && parsed.every((x: unknown) => typeof x === 'string')) {
            this.displayImages = HeroBannerComponent.normalizeImagePaths(parsed as string[]);
          }
        } catch {
          /* keep [] */
        }
        this.startSlider();
      },
      error: () => this.startSlider()
    });
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  private static normalizeImagePaths(paths: string[]): string[] {
    return paths.map((s) => s.trim()).filter(Boolean);
  }

  private stopSlider(): void {
    if (this.slideIntervalId != null) {
      clearInterval(this.slideIntervalId);
      this.slideIntervalId = null;
    }
  }

  private startSlider(): void {
    this.stopSlider();
    const n = this.displayImages.length;
    if (n < 1) {
      return;
    }
    this.slideIntervalId = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % n;
    }, 5000);
  }

  get currentBgImage(): string {
    const imgs = this.displayImages;
    if (imgs.length < 1) {
      return '';
    }
    const i = this.currentSlideIndex % imgs.length;
    const raw = imgs[i];
    return raw.startsWith('/uploads/') ? fileUrlToAbsolute(raw) : raw;
  }
}
