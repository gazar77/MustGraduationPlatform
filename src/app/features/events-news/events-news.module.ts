import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EventsNewsRoutingModule } from './events-news-routing.module';
import { NewsListComponent } from './news-list/news-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@NgModule({
  declarations: [
    NewsListComponent,
    EventListComponent,
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsNewsRoutingModule,
    HeroBannerComponent
  ]
})
export class EventsNewsModule { }
