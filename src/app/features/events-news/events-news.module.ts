import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EventsNewsRoutingModule } from './events-news-routing.module';
import { NewsListComponent } from './news-list/news-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { NewsEventsFullPageComponent } from './news-events-full-page/news-events-full-page.component';
import { EventsNewsDefaultRedirectComponent } from './events-news-default-redirect/events-news-default-redirect.component';

@NgModule({
  declarations: [
    NewsListComponent,
    EventListComponent,
    EventDetailsComponent,
    NewsEventsFullPageComponent,
    EventsNewsDefaultRedirectComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsNewsRoutingModule,
    HeroBannerComponent
  ]
})
export class EventsNewsModule { }
