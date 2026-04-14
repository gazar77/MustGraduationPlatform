import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-news-events-full-page',
  templateUrl: './news-events-full-page.component.html',
  styleUrls: ['./news-events-full-page.component.scss'],
  standalone: false
})
export class NewsEventsFullPageComponent implements OnInit {
  section: 'news' | 'events' = 'news';

  constructor(
    private router: Router,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    const u = this.router.url.split('?')[0];
    this.section = u.startsWith('/events') ? 'events' : 'news';
  }
}
