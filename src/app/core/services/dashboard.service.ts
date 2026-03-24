import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { DashboardStats, Activity } from '../models/dashboard-stats.model';
import { IdeaService } from './idea.service';
import { NewsService } from './news.service';
import { EventService } from './event.service';
import { TemplateService } from './template.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockActivities: Activity[] = [
    {
      id: 1,
      type: 'News',
      description: 'تم إضافة خبر جديد: توزيع مشاريع التخرج',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      user: 'أدمن النظام'
    },
    {
      id: 2,
      type: 'Idea',
      description: 'تم تحديث حالة فكرة: نظام إدارة مشاريع التخرج',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      user: 'د. محمد علي'
    },
    {
      id: 3,
      type: 'Proposal',
      description: 'تقديم مقترح جديد من فريق "Alpha"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      user: 'أحمد محمود'
    }
  ];

  constructor(
    private ideaService: IdeaService,
    private newsService: NewsService,
    private eventService: EventService,
    private templateService: TemplateService
  ) { }

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      ideas: this.ideaService.getIdeas(),
      news: this.newsService.getNews(),
      events: this.eventService.getEvents(),
      templates: this.templateService.getTemplates()
    }).pipe(
      map(data => ({
        totalIdeas: data.ideas.length,
        reservedIdeas: data.ideas.filter(i => i.status === 'Reserved').length,
        approvedIdeas: data.ideas.filter(i => i.status === 'Approved').length,
        totalDoctors: 15, // Mock value
        totalProposals: 12, // Mock value
        visibleContentCount: data.news.filter(n => n.isVisible).length + 
                             data.events.filter(e => e.isVisible).length +
                             data.templates.filter(t => t.isVisible).length
      }))
    );
  }

  getRecentActivities(): Observable<Activity[]> {
    return of(this.mockActivities);
  }

  addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
    const newActivity: Activity = {
      ...activity,
      id: this.mockActivities.length + 1,
      timestamp: new Date()
    };
    this.mockActivities.unshift(newActivity);
    if (this.mockActivities.length > 20) {
      this.mockActivities.pop();
    }
  }
}
