import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Template } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private mockTemplates: Template[] = [
    {
      id: 1,
      title: 'قالب المقترح (Proposal Template)',
      description: 'النموذج الرسمي لكتابة مقترح مشروع التخرج.',
      fileUrl: '#',
      fileSize: '1.2 MB',
      lastUpdate: new Date('2026-02-15'),
      isVisible: true,
      order: 1
    },
    {
      id: 2,
      title: 'قالب العرض التقديمي (PPT Template)',
      description: 'التصميم المعتمد للعروض التقديمية للمناقشات.',
      fileUrl: '#',
      fileSize: '3.5 MB',
      lastUpdate: new Date('2026-01-10'),
      isVisible: true,
      order: 2
    },
    {
      id: 3,
      title: 'دليل التوثيق (IEEE Citation Guide)',
      description: 'دليل شامل لكيفية كتابة المراجع بطريقة IEEE.',
      fileUrl: '#',
      fileSize: '0.8 MB',
      lastUpdate: new Date('2025-12-01'),
      isVisible: true,
      order: 3
    }
  ];

  constructor() { }

  getTemplates(): Observable<Template[]> {
    return of(this.mockTemplates);
  }

  getVisibleTemplates(): Observable<Template[]> {
    return of(this.mockTemplates.filter(t => t.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  getTemplateById(id: number): Observable<Template | undefined> {
    return of(this.mockTemplates.find(t => t.id === id));
  }

  addTemplate(template: Template): Observable<Template> {
    const newId = Math.max(...this.mockTemplates.map(t => t.id || 0)) + 1;
    const newItem = { ...template, id: newId, lastUpdate: new Date(), isVisible: true };
    this.mockTemplates.push(newItem);
    return of(newItem);
  }

  updateTemplate(id: number, data: Partial<Template>): Observable<Template | undefined> {
    const index = this.mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTemplates[index] = { ...this.mockTemplates[index], ...data };
      return of(this.mockTemplates[index]);
    }
    return of(undefined);
  }

  deleteTemplate(id: number): Observable<boolean> {
    const index = this.mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTemplates.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  toggleVisibility(id: number): Observable<Template | undefined> {
    const index = this.mockTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTemplates[index].isVisible = !this.mockTemplates[index].isVisible;
      return of(this.mockTemplates[index]);
    }
    return of(undefined);
  }
}
