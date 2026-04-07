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

  constructor(
    private eventService: EventService, 
    private authService: AuthService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.eventService.getVisibleEvents().subscribe(events => {
      this.events = events;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getCategoryTranslation(category: string): string {
    return this.langService.translate(`events.list.category.${category}`) || category;
  }

  eventImageUrl(ev: Event): string {
    return fileUrlToAbsolute(ev.image);
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
        category: 'academic',
        isVisible: true,
        order: 0
      }).subscribe(() => {
        this.eventService.getEvents().subscribe(events => this.events = events);
      });
    }
  }
}
