import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkTheme = new BehaviorSubject<boolean>(this.getInitialTheme());
  isDarkTheme$ = this.darkTheme.asObservable();

  constructor() {
    this.applyTheme(this.darkTheme.value);
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  }

  toggleTheme() {
    const newValue = !this.darkTheme.value;
    this.darkTheme.next(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.setAttribute('data-theme', 'light');
    }
  }
}
