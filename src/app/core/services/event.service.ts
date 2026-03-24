import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private mockEvents: Event[] = [
    {
      id: 1,
      title: 'مناقشات مشاريع التخرج - الدفعة الأولى',
      date: '2026-04-15',
      time: '09:00 AM',
      image: 'assets/must_discussion_1.png',
      location: 'قاعة المؤتمرات الرئيسية',
      description: 'مناقشة الدفعة الأولى من مشاريع التخرج لطلاب الفرقة الرابعة بقسم علوم الحاسب والتخصصات المختلفة.',
      category: 'academic',
      organizer: 'قسم علوم الحاسب',
      isVisible: true,
      order: 1
    },
    {
      id: 2,
      title: 'ورشة عمل: الذكاء الاصطناعي في الرعاية الصحية',
      date: '2026-05-10',
      time: '11:00 AM',
      image: 'assets/must_discussion_2.png',
      location: 'معمل 4B',
      description: 'ورشة عمل تطبيقية حول استخدام تقنيات تعلم الآلة في تحليل البيانات الطبية وتطوير أنظمة التشخيص الذكية.',
      category: 'workshop',
      organizer: 'نادي الابتكار التكنولوجي',
      isVisible: true,
      order: 2
    },
    {
      id: 3,
      title: 'المعرض السنوي للابتكارات الطلابية',
      date: '2026-06-01',
      time: '10:00 AM',
      image: 'assets/must_discussion_3.png',
      location: 'ساحة الكلية',
      description: 'عرض لأبرز الابتكارات والمشاريع المتميزة التي طورها طلاب الكلية خلال العام الدراسي الحالي بمشاركة كبرى الشركات.',
      category: 'social',
      organizer: 'رعاية الشباب بالكلية',
      isVisible: true,
      order: 3
    },
    {
      id: 4,
      title: 'مسابقة البرمجة التنافسية (FCI-CP)',
      date: '2026-07-20',
      time: '08:00 AM',
      image: 'assets/must_discussion_1.png',
      location: 'معامل البرمجة المتقدمة',
      description: 'المسابقة السنوية للبرمجة التنافسية لترشيح فرق الكلية للمسابقات الإقليمية والدولية (ICPC).',
      category: 'competition',
      organizer: 'لجنة الأنشطة العلمية',
      isVisible: true,
      order: 4
    }
  ];

  constructor() { }

  getEvents(): Observable<Event[]> {
    return of(this.mockEvents);
  }

  getVisibleEvents(): Observable<Event[]> {
    return of(this.mockEvents.filter(e => e.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  getEventById(id: number): Observable<Event | undefined> {
    return of(this.mockEvents.find(e => e.id === id));
  }

  addEvent(event: Event): Observable<Event> {
    const newId = Math.max(...this.mockEvents.map(e => e.id || 0)) + 1;
    const newEvent = { ...event, id: newId, isVisible: true };
    this.mockEvents.push(newEvent);
    return of(newEvent);
  }

  updateEvent(id: number, data: Partial<Event>): Observable<Event | undefined> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...data };
      return of(this.mockEvents[index]);
    }
    return of(undefined);
  }

  deleteEvent(id: number): Observable<boolean> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  toggleVisibility(id: number): Observable<Event | undefined> {
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents[index].isVisible = !this.mockEvents[index].isVisible;
      return of(this.mockEvents[index]);
    }
    return of(undefined);
  }
}
