import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { DEFAULT_HERO_BANNER_IMAGES, HERO_BANNER_BG_IMAGES_KEY } from '../../../core/constants/hero-banner-settings';
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

  /** Resolved paths (from input override, API, or defaults). */
  displayImages: string[] = [...DEFAULT_HERO_BANNER_IMAGES];

  currentSlideIndex = 0;
  private slideIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    public langService: LanguageService,
    private siteSettingsService: SiteSettingsService
  ) {}

  ngOnInit(): void {
    if (this.bgImages && this.bgImages.length > 0) {
      this.displayImages = [...this.bgImages];
      this.startSlider();
      return;
    }

    this.siteSettingsService.getSetting(HERO_BANNER_BG_IMAGES_KEY).subscribe({
      next: (res) => {
        const raw = this.siteSettingsService.parseStoredValue(res.value);
        try {
          const parsed = JSON.parse(raw) as unknown;
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed.every((x: unknown) => typeof x === 'string')
          ) {
            this.displayImages = parsed as string[];
          }
        } catch {
          /* keep defaults */
        }
        this.startSlider();
      },
      error: () => this.startSlider()
    });
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  private stopSlider(): void {
    if (this.slideIntervalId != null) {
      clearInterval(this.slideIntervalId);
      this.slideIntervalId = null;
    }
  }

  private startSlider(): void {
    this.stopSlider();
    if (this.displayImages.length < 1) {
      this.displayImages = [...DEFAULT_HERO_BANNER_IMAGES];
    }
    const n = this.displayImages.length;
    this.slideIntervalId = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % n;
    }, 5000);
  }

  get currentBgImage(): string {
    const imgs = this.displayImages.length > 0 ? this.displayImages : DEFAULT_HERO_BANNER_IMAGES;
    const i = this.currentSlideIndex % imgs.length;
    return imgs[i];
  }
}
