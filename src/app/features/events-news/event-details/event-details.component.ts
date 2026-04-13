import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { LanguageService } from '../../../core/services/language.service';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  eventHeroImage(ev: Event): string {
    return fileUrlToAbsolute(ev.image);
  }
}
