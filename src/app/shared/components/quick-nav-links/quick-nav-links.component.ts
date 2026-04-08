import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-quick-nav-links',
  templateUrl: './quick-nav-links.component.html',
  styleUrls: ['./quick-nav-links.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class QuickNavLinksComponent implements AfterViewInit, OnDestroy {
  readonly portalLinks: { labelKey: string, url: string }[] = [
    { labelKey: 'req1', url: '/submission/project-registration-1' },
    { labelKey: 'req2', url: '/submission/project-registration-2' }
  ];

  readonly resourceLinks: { labelKey: string, url: string }[] = [
    { labelKey: 'tutorials', url: '/resources/tutorials' },
    { labelKey: 'templates', url: '/templates' }
  ];

  @ViewChild('portalDropdown') portalDropdown?: ElementRef<HTMLElement>;
  @ViewChild('resourcesDropdown') resourcesDropdown?: ElementRef<HTMLElement>;
  @ViewChild('scrollRegion') scrollRegion?: ElementRef<HTMLElement>;

  portalMenuOpen = false;
  resourcesMenuOpen = false;

  canScrollPrev = false;
  canScrollNext = false;

  private resizeObserver?: ResizeObserver;

  constructor(
    public langService: LanguageService,
    destroyRef: DestroyRef
  ) {
    this.langService.currentLang$.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
      queueMicrotask(() => this.updateScrollButtons());
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateScrollButtons());
    const el = this.scrollRegion?.nativeElement;
    if (el && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateScrollButtons());
      this.resizeObserver.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateScrollButtons();
  }

  onScrollRegion(): void {
    this.updateScrollButtons();
  }

  scrollNav(direction: -1 | 1): void {
    const el = this.scrollRegion?.nativeElement;
    if (!el) return;
    const step = Math.max(120, Math.floor(el.clientWidth * 0.7));
    const rtl = el.closest('.quick-nav-root')?.getAttribute('dir') === 'rtl';
    const delta = rtl ? -direction * step : direction * step;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  }

  private updateScrollButtons(): void {
    const el = this.scrollRegion?.nativeElement;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const epsilon = 2;
    const rtl = el.closest('.quick-nav-root')?.getAttribute('dir') === 'rtl';
    let sl = el.scrollLeft;
    if (rtl && sl < 0) {
      sl = max + sl;
    }
    this.canScrollPrev = sl > epsilon;
    this.canScrollNext = sl < max - epsilon;
  }

  togglePortalMenu(event: MouseEvent): void {
    if (window.innerWidth < 992) {
      event.preventDefault();
      event.stopPropagation();
      this.portalMenuOpen = !this.portalMenuOpen;
      if (this.portalMenuOpen) {
        this.resourcesMenuOpen = false;
      }
    }
  }

  toggleResourcesMenu(event: MouseEvent): void {
    if (window.innerWidth < 992) {
      event.preventDefault();
      event.stopPropagation();
      this.resourcesMenuOpen = !this.resourcesMenuOpen;
      if (this.resourcesMenuOpen) {
        this.portalMenuOpen = false;
      }
    }
  }

  closePortalMenu(): void {
    this.portalMenuOpen = false;
  }

  closeResourcesMenu(): void {
    this.resourcesMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (window.innerWidth >= 992) return;
    const t = event.target as Node;
    const pr = this.portalDropdown?.nativeElement;
    const rs = this.resourcesDropdown?.nativeElement;
    if (this.portalMenuOpen && pr && !pr.contains(t)) {
      this.portalMenuOpen = false;
    }
    if (this.resourcesMenuOpen && rs && !rs.contains(t)) {
      this.resourcesMenuOpen = false;
    }
  }
}
