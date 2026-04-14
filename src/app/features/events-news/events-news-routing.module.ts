import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './news-list/news-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewsEventsFullPageComponent } from './news-events-full-page/news-events-full-page.component';
import { EventsNewsDefaultRedirectComponent } from './events-news-default-redirect/events-news-default-redirect.component';

const routes: Routes = [
  { path: 'list', component: NewsListComponent },
  { path: 'calendar', component: EventListComponent },
  { path: 'details/:id', component: EventDetailsComponent },
  { path: 'all', component: NewsEventsFullPageComponent },
  { path: '', component: EventsNewsDefaultRedirectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsNewsRoutingModule { }
