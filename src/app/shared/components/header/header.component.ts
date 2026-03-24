import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthMockService } from '../../../core/services/auth-mock.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  isScrolled = false;
  currentUser: User | null = null;
  currentLang: 'ar' | 'en' = 'en';
  isDarkTheme = false;
  activeDropdown: string | null = null;

  constructor(
    public router: Router, 
    private authService: AuthMockService,
    public themeService: ThemeService,
    public langService: LanguageService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeAllMenus();
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.langService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
  }

  logout() {
    this.authService.logout();
    this.closeAllMenus();
    this.router.navigate(['/auth/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLanguage() {
    this.langService.toggleLanguage();
  }

  getTranslation(key: string): string {
    return this.langService.translate(key);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.has-dropdown')) {
      this.activeDropdown = null;
    }
  }

  toggleDropdown(dropdownName: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === dropdownName ? null : dropdownName;
  }

  onMouseEnter(dropdownName: string) {
    if (window.innerWidth >= 992) {
      this.activeDropdown = dropdownName;
    }
  }

  onMouseLeave() {
    // Disabled auto-hide as per user request to keep lists visible until a page is clicked
    // this.activeDropdown = null;
  }

  isDropdownOpen(dropdownName: string): boolean {
    return this.activeDropdown === dropdownName;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  closeAllMenus() {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
  }
}
