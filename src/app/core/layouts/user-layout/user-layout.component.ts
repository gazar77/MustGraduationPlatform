import { Component } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  template: `
    <app-header></app-header>
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
    <app-site-quick-nav></app-site-quick-nav>
    <app-footer></app-footer>
  `,
  styles: [`
    .content-area {
      min-height: 80vh;
    }
  `]
})
export class UserLayoutComponent {}
