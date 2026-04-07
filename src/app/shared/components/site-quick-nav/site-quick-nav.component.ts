import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickNavLinksComponent } from '../quick-nav-links/quick-nav-links.component';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-site-quick-nav',
  standalone: true,
  imports: [CommonModule, QuickNavLinksComponent],
  template: `
    <section class="site-quick-nav-strip" [attr.dir]="(lang.currentLang$ | async) === 'ar' ? 'rtl' : 'ltr'">
      <div class="container site-quick-nav-inner py-3">
        <app-quick-nav-links></app-quick-nav-links>
      </div>
    </section>
  `,
  styles: [`
    .site-quick-nav-strip {
      background: linear-gradient(180deg, #022561 0%, #0c1935 100%);
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
    }
    .site-quick-nav-inner {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  `]
})
export class SiteQuickNavComponent {
  constructor(public lang: LanguageService) {}
}
