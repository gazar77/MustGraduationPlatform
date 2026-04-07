import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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

  /** Primary hero pills (excludes the three submission routes — those live under Portal Services). */
  @Input() mainQuickLinks: { labelKey: string, url: string }[] = [
    { labelKey: 'home', url: '/dashboard' },
    { labelKey: 'ideas', url: '/ideas' },
    { labelKey: 'register', url: '/ideas/register' },
    { labelKey: 'templates', url: '/templates' },
    { labelKey: 'news', url: '/news/list' },
    { labelKey: 'events', url: '/events/calendar' },
    { labelKey: 'contact', url: '/contact' }
  ];

  readonly portalLinks: { labelKey: string, url: string }[] = [
    { labelKey: 'submitProposal', url: '/submission/proposal' },
    { labelKey: 'req1', url: '/submission/project-registration-1' },
    { labelKey: 'req2', url: '/submission/project-registration-2' }
  ];

  @ViewChild('portalDropdown') portalDropdown?: ElementRef<HTMLElement>;

  /** Mobile: tap toggles the portal submenu. */
  portalMenuOpen = false;

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

  togglePortalMenu(event: MouseEvent): void {
    if (window.innerWidth < 992) {
      event.preventDefault();
      event.stopPropagation();
      this.portalMenuOpen = !this.portalMenuOpen;
    }
  }

  closePortalMenu(): void {
    this.portalMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (window.innerWidth >= 992) return;
    const root = this.portalDropdown?.nativeElement;
    if (!root || !this.portalMenuOpen) return;
    const t = event.target as Node;
    if (root.contains(t)) return;
    this.portalMenuOpen = false;
  }

}

