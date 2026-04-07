import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
export class QuickNavLinksComponent {
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

  portalMenuOpen = false;
  resourcesMenuOpen = false;

  constructor(public langService: LanguageService) {}

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
