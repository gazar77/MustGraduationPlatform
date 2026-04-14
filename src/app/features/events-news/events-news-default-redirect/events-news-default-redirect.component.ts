import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-news-default-redirect',
  template: '',
  standalone: false
})
export class EventsNewsDefaultRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const u = this.router.url.split('?')[0];
    if (u === '/events' || u === '/events/') {
      this.router.navigate(['/events/calendar'], { replaceUrl: true });
    } else {
      this.router.navigate(['/news/list'], { replaceUrl: true });
    }
  }
}
