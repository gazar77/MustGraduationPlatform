import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-tutorials-page',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent],
  template: `
    <div class="tutorials-page" [attr.dir]="(lang.currentLang$ | async) === 'ar' ? 'rtl' : 'ltr'">
      <app-hero-banner [title]="lang.translate('tutorials.title')"></app-hero-banner>
      <div class="container py-5">
        <p class="lead text-muted">{{ lang.translate('tutorials.placeholder') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .tutorials-page { min-height: 40vh; background: #f5f7fa; }
  `]
})
export class TutorialsPageComponent {
  constructor(public lang: LanguageService) {}
}
