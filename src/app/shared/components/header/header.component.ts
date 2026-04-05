import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { MENU_ITEMS, MenuItem } from '../../../core/data/navigation.data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  menuItems = MENU_ITEMS;
  
  // Desktop menu states
  activeDropdown: MenuItem | null = null;
  activeLeftItem: MenuItem | null = null;
  hoverTimeout: any;

  // Mobile menu states
  isMobileMenuOpen = false;
  mobileActiveItem: MenuItem | null = null;
  mobileActiveSubItem: MenuItem | null = null;

  private routerSub: Subscription;

  constructor(
    private router: Router,
    public authService: AuthService,
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {
    // Close menus on navigation
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenus();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    clearTimeout(this.hoverTimeout);
  }

  // --- Desktop Hover Logic ---
  onMouseEnter(item: MenuItem): void {
    if (window.innerWidth > 991) {
      clearTimeout(this.hoverTimeout);
      
      // If we are opening a menu from scratch (meaning no other menu is currently open),
      // we clear the activeLeftItem so the right panel starts COMPLETELY empty as requested.
      // If we are quickly switching between menus, we leave it alone to prevent the closing menu from flickering gracefully.
      if (!this.activeDropdown) {
        this.activeLeftItem = null;
      }
      
      this.activeDropdown = item;
    }
  }

  onMouseLeave(): void {
    if (window.innerWidth > 991) {
      this.hoverTimeout = setTimeout(() => {
        this.activeDropdown = null;
        this.activeLeftItem = null;
      }, 150); // slight delay to prevent flicker when moving between nav items
    }
  }

  onLeftPanelHover(child: MenuItem): void {
    if (window.innerWidth > 991) {
      this.activeLeftItem = child;
    }
  }

  // --- Mobile Menu Logic ---
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleMobileItem(item: MenuItem, event: Event): void {
    event.preventDefault();
    this.mobileActiveItem = this.mobileActiveItem === item ? null : item;
    this.mobileActiveSubItem = null;
  }

  toggleMobileSubItem(subItem: MenuItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.mobileActiveSubItem = this.mobileActiveSubItem === subItem ? null : subItem;
  }

  closeMenus(): void {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
    this.activeLeftItem = null;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
      this.closeMenus();
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
