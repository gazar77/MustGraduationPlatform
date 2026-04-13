import { Component, OnInit } from '@angular/core';
import { Event } from '../../../core/models/event.model';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { LanguageService } from '../../../core/services/language.service';
import { EventService } from '../../../core/services/event.service';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  currentUser: User | null = null;
  carouselStart = 0;
  readonly pageSize = 3;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.eventService.getVisibleEvents().subscribe(events => {
      this.events = events;
      this.carouselStart = 0;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get visibleEvents(): Event[] {
    return this.events.slice(this.carouselStart, this.carouselStart + this.pageSize);
  }

  get canSlidePrev(): boolean {
    return this.carouselStart > 0;
  }

  get canSlideNext(): boolean {
    return this.carouselStart + this.pageSize < this.events.length;
  }

  slidePrev(): void {
    if (this.canSlidePrev) this.carouselStart--;
  }

  slideNext(): void {
    if (this.canSlideNext) this.carouselStart++;
  }

  eventImageUrl(ev: Event): string {
    return fileUrlToAbsolute(ev.image);
  }

  /** Only Admin may add from this page; SuperAdmin uses /admin/manage/events. */
  canAddEvent(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  onAddEvent(): void {
    const titlePrompt = this.langService.translate('events.list.prompts.newTitle');
    const descPrompt = this.langService.translate('events.list.prompts.newDesc');

    const title = prompt(titlePrompt);
    const description = prompt(descPrompt);
    if (title && description) {
      this.eventService.addEvent({
        id: 0,
        title,
        description,
        date: new Date().toISOString().split('T')[0],
        time: '09:00 AM',
        location: this.langService.translate('events.list.defaultLoc'),
        image: 'assets/must_discussion_1.png',
        category: '',
        isVisible: true,
        order: 0
      }).subscribe(() => {
        this.eventService.getEvents().subscribe(events => this.events = events);
      });
    }
  }
}
