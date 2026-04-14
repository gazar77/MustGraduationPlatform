import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../core/models/event.model';
import { LanguageService } from '../../../core/services/language.service';
import { EventService } from '../../../core/services/event.service';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  /** When true, show all items in a grid and hide hero (used on `/events/all`). */
  @Input() viewAll = false;

  events: Event[] = [];
  carouselStart = 0;
  readonly pageSize = 3;

  constructor(
    private eventService: EventService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.eventService.getVisibleEvents().subscribe(events => {
      this.events = events;
      this.carouselStart = 0;
    });
  }

  get visibleEvents(): Event[] {
    return this.events.slice(this.carouselStart, this.carouselStart + this.pageSize);
  }

  get displayEvents(): Event[] {
    return this.viewAll ? this.events : this.visibleEvents;
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
}
