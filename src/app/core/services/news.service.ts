import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private mockNews: News[] = [
    {
      id: 1,
      title: 'إعلان توزيع مشاريع التخرج',
      content: 'نحيطكم علماً بأنه قد تم توزيع لجان الإشراف على مشاريع التخرج للعام الجامعي الحالي...',
      author: 'إدارة الكلية',
      publishDate: new Date('2026-03-05'),
      category: 'Announcement',
      isVisible: true,
      order: 1
    },
    {
      id: 2,
      title: 'ورشة عمل حول كتابة المقترح (Proposal)',
      content: 'ستقام ورشة عمل يوم الأثنين القادم بقاعة المؤتمرات بالكلية لتدريب الطلاب على كيفية صياغة مقترح المشروع...',
      author: 'وحدة ضمان الجودة',
      publishDate: new Date('2026-03-08'),
      category: 'Event',
      isVisible: true,
      order: 2
    }
  ];

  constructor() { }

  getNews(): Observable<News[]> {
    return of(this.mockNews);
  }

  getVisibleNews(): Observable<News[]> {
    return of(this.mockNews.filter(n => n.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  getNewsById(id: number): Observable<News | undefined> {
    return of(this.mockNews.find(n => n.id === id));
  }

  addNews(news: News): Observable<News> {
    const newId = Math.max(...this.mockNews.map(n => n.id || 0)) + 1;
    const newItem = { ...news, id: newId, publishDate: new Date(), isVisible: true };
    this.mockNews.unshift(newItem);
    return of(newItem);
  }

  updateNews(id: number, data: Partial<News>): Observable<News | undefined> {
    const index = this.mockNews.findIndex(n => n.id === id);
    if (index !== -1) {
      this.mockNews[index] = { ...this.mockNews[index], ...data };
      return of(this.mockNews[index]);
    }
    return of(undefined);
  }

  deleteNews(id: number): Observable<boolean> {
    const index = this.mockNews.findIndex(n => n.id === id);
    if (index !== -1) {
      this.mockNews.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  toggleVisibility(id: number): Observable<News | undefined> {
    const index = this.mockNews.findIndex(n => n.id === id);
    if (index !== -1) {
      this.mockNews[index].isVisible = !this.mockNews[index].isVisible;
      return of(this.mockNews[index]);
    }
    return of(undefined);
  }
}
